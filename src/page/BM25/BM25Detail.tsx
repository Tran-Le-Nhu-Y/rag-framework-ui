import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { BM25Retriever } from '../../@types/entities';
import {
  useGetEmbeddingById,
  useGetFileById,
  useGetTokenById,
} from '../../service';
import { useState, useEffect } from 'react';
import { AppSnackbar } from '../../component';
import { SnackbarSeverity, HideDuration } from '../../util';
import { downloadFile } from '../../service/api';
import { FilePreviewCard } from '../../component/FilePreviewCard';

export default function BM25DetailDialog({
  open,
  bm25,
  onExit,
}: {
  open: boolean;
  bm25: BM25Retriever | null;
  onExit: () => void;
}) {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const embeddingModelId = bm25?.embeddings_id;
  const embeddingModelDetail = useGetEmbeddingById(embeddingModelId!, {
    skip: !embeddingModelId,
  });
  useEffect(() => {
    if (embeddingModelDetail.isError) {
      setSnackbarMessage(t('embeddingModelLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [embeddingModelDetail.data, embeddingModelDetail.isError, t]);

  const fileId = bm25?.removal_words_file_id ?? '';

  const fileDetail = useGetFileById(fileId!, {
    skip: !fileId,
  });
  useEffect(() => {
    console.log('File info:', fileDetail.data);
    if (fileDetail.isError) {
      setSnackbarMessage(t('fileLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [fileDetail, fileDetail.data, fileDetail.isError, t]);

  const [getTokenById] = useGetTokenById();
  const handleDownloadFile = async () => {
    if (!fileId || !fileDetail.data) return;

    try {
      const token = await getTokenById(fileId).unwrap();

      const link = document.createElement('a');
      link.href = downloadFile(token);
      link.download = fileDetail.data.name;
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

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('bm25DetailInformation')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack
          justifyContent={'center'}
          alignItems="center"
          spacing={2}
          sx={{ mt: 1, mb: 1 }}
        >
          <AppSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            autoHideDuration={HideDuration.FAST}
            onClose={() => setSnackbarOpen(false)}
          />
          <Stack spacing={2} width="100%">
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('bm25Name')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {bm25?.name || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('weight')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {bm25?.weight || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('k')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {bm25?.k || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('embeddingModel')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {embeddingModelDetail.data?.name || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('enable_remove_emoji')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {bm25?.enable_remove_emoji ? t('true') : t('false')}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('enable_remove_emoticon')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {bm25?.enable_remove_emoticon ? t('true') : t('false')}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('removal_words_file')}:
              </Typography>
              {fileDetail.isLoading ? (
                <Typography variant="body1">{t('loading')}</Typography>
              ) : fileDetail.data ? (
                <FilePreviewCard
                  file={fileDetail.data}
                  onDownload={handleDownloadFile}
                />
              ) : (
                <Typography variant="body1" fontStyle="italic">
                  N/A
                </Typography>
              )}
            </Stack>

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" color="info" onClick={onExit}>
                {t('exit')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
