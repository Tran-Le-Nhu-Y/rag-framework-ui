import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ImageRecognizer } from '../../@types/entities';
import { useGetFileById, useGetTokenById } from '../../service';
import { useState, useEffect } from 'react';
import { AppSnackbar } from '../../component';
import { downloadFile } from '../../service/api';
import { SnackbarSeverity, HideDuration } from '../../util';
import { FilePreviewCard } from '../../component/FilePreviewCard';

export default function CNNModelDetailDialog({
  open,
  recognizer,
  onExit,
}: {
  open: boolean;
  recognizer: ImageRecognizer | null;
  onExit: () => void;
}) {
  const { t } = useTranslation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const modelFileId = recognizer?.model_file_id ?? '';
  const modelFileDetail = useGetFileById(modelFileId!, {
    skip: !modelFileId,
  });
  useEffect(() => {
    if (modelFileDetail.isError) {
      setSnackbarMessage(t('fileLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [modelFileDetail, modelFileDetail.data, modelFileDetail.isError, t]);

  const [getTokenById] = useGetTokenById();
  const handleDownloadFile = async () => {
    if (!modelFileId || !modelFileDetail.data) return;

    try {
      const token = await getTokenById(modelFileId).unwrap();

      const link = document.createElement('a');
      link.href = downloadFile(token);
      link.download = modelFileDetail.data.name;
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(t('fileLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };
  if (!recognizer || !recognizer.preprocessing_configs) return null;
  return (
    <Dialog open={open} onClose={onExit} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5">
          {t('recognitionModelDetailInformation')}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, mb: 1 }}>
          <AppSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            autoHideDuration={HideDuration.FAST}
            onClose={() => setSnackbarOpen(false)}
          />
          {/* Basic Info */}
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">
              {t('recognitionModelName')}:
            </Typography>
            <Typography>{recognizer.name}</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">{t('minProbability')}:</Typography>
            <Typography>{recognizer.min_probability}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">{t('maxResults')}:</Typography>
            <Typography>{recognizer.max_results}</Typography>
          </Stack>

          {/* Model file */}
          <Divider />

          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography fontWeight="bold">{t('modelFile')}:</Typography>

            {modelFileDetail.isLoading ? (
              <Typography variant="body1">{t('loading')}</Typography>
            ) : modelFileDetail.data ? (
              <FilePreviewCard
                file={modelFileDetail.data}
                onDownload={handleDownloadFile}
              />
            ) : (
              <Typography variant="body1" fontStyle="italic">
                N/A
              </Typography>
            )}
          </Stack>

          {/* Classes */}

          {recognizer.output_classes && (
            <>
              <Divider />
              <Typography fontWeight="bold">
                {t('outputClassRecognitionModelDescription')}:
              </Typography>
              <Stack pl={2} spacing={1}>
                {recognizer.output_classes.map((cls, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <Typography>{`- ${cls.name}`}:</Typography>
                    <Typography color="text.secondary">
                      {cls.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}

          {/* Preprocessing */}
          <Divider />
          <Typography fontWeight="bold">
            {t('preprocessing_configs')}:
          </Typography>
          <Stack pl={2} spacing={1}>
            {recognizer.preprocessing_configs.map((config, index) => {
              switch (config.type) {
                case 'resize':
                  return (
                    <Typography key={index}>
                      • Resize → Target: {config.target_size}, Interpolation:{' '}
                      {config.interpolation}
                    </Typography>
                  );
                case 'pad':
                  return (
                    <Typography key={index}>
                      • Pad → Padding: {config.padding}, Fill: {config.fill},
                      Mode: {config.mode}
                    </Typography>
                  );
                case 'grayscale':
                  return (
                    <Typography key={index}>
                      • Grayscale → Output Channels:{' '}
                      {config.num_output_channels}
                    </Typography>
                  );
                default:
                  return null;
              }
            })}
          </Stack>

          {/* Buttons */}
          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button variant="outlined" color="info" onClick={onExit}>
              {t('exit')}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
