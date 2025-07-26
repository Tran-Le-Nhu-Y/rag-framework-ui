import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  Link,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';

// Fake data
const fakeModel = {
  name: 'AnimalClassifierV1',
  description: 'Model to classify animal images into various categories',
  type: 'CNN',
  minProbability: 0.6,
  maxResults: 10,
  modelFileName: 'animal_model.tflite',
  modelFileUrl: '/downloads/animal_model.tflite',
  classDescriptionFileName: 'classes_description.txt',
  classDescriptionFileUrl: '/downloads/classes_description.txt',
  classes: [
    { className: 'Cat', classDescription: 'Small domesticated feline' },
    { className: 'Dog', classDescription: 'Domestic dog, canine' },
    { className: 'Elephant', classDescription: 'Large herbivorous mammal' },
  ],
  preprocessing: [
    {
      type: 'resize',
      targetsize: '224x224',
      interpolation: 'bilinear',
      maxsize: '256x256',
    },
    {
      type: 'pad',
      padding: '10',
      fill: 'black',
      mode: 'constant',
    },
    {
      type: 'grayscale',
      num_output_channels: '1',
    },
  ],
};

export default function CNNModelDetailDialog({
  open,
  onExit,
}: {
  open: boolean;
  onExit: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onExit} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5">
          {t('recognitionModelDetailInformation')}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, mb: 1 }}>
          {/* Basic Info */}
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">
              {t('recognitionModelName')}:
            </Typography>
            <Typography>{fakeModel.name}</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">{t('minProbability')}:</Typography>
            <Typography>{fakeModel.minProbability}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">{t('maxResults')}:</Typography>
            <Typography>{fakeModel.maxResults}</Typography>
          </Stack>

          {/* Model file */}
          <Divider />

          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography fontWeight="bold">{t('modelFile')}:</Typography>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                pl: 2,
                backgroundColor: '#f9f9f9',
              }}
            >
              <DescriptionIcon color="action" />
              <Typography flexGrow={1}>{fakeModel.modelFileName}</Typography>
              <Link
                href={fakeModel.modelFileName}
                target="_blank"
                rel="noopener"
                underline="none"
              >
                <Tooltip title={t('download')}>
                  <IconButton color="primary">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </Paper>
          </Stack>

          {/* Class description file (if uploaded) */}
          {fakeModel.classDescriptionFileName && (
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Typography fontWeight="bold">
                {t('classDescriptionFile')}:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1,
                  pl: 2,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <DescriptionIcon color="action" />
                <Typography flexGrow={1}>
                  {fakeModel.classDescriptionFileName}
                </Typography>
                <Link
                  href={fakeModel.classDescriptionFileUrl}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                >
                  <Tooltip title={t('download')}>
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Paper>
            </Stack>
          )}

          {/* Classes */}

          {!fakeModel.classDescriptionFileName && (
            <>
              <Divider />
              <Typography fontWeight="bold">
                {t('outputClassRecognitionModelDescription')}:
              </Typography>
              <Stack pl={2} spacing={1}>
                {fakeModel.classes.map((cls, index) => (
                  <Stack key={index} direction="row" spacing={2}>
                    <Typography>{`- ${cls.className}`}</Typography>
                    <Typography color="text.secondary">
                      {cls.classDescription}
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
            {fakeModel.preprocessing.map((config, index) => {
              switch (config.type) {
                case 'resize':
                  return (
                    <Typography key={index}>
                      • Resize → Target: {config.targetsize}, Max:{' '}
                      {config.maxsize}, Interpolation: {config.interpolation}
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
