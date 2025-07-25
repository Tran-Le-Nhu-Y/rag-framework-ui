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
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';

export default function CNNModelDetailDialog({
  open,
  recognitionModelName = '',
  recognitionModelDescription = '',
  recognitionModelType = '',
  onExit,
  onExport,
}: {
  open: boolean;
  recognitionModelName?: string;
  recognitionModelDescription?: string;
  recognitionModelType?: string;
  onExit: () => void;
  onExport: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">
          {t('recognitionModelDetailInformation')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack
          justifyContent={'center'}
          alignItems="center"
          spacing={2}
          sx={{ mt: 1, mb: 1 }}
        >
          <Stack spacing={2} width="100%">
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('recognitionModelName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {recognitionModelName || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('recognitionModelDescription')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {recognitionModelDescription || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('recognitionModelType')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {recognitionModelType || 'N/A'}
              </Typography>
            </Stack>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('configFile')}:
            </Typography>

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={onExport}
                startIcon={<SimCardDownloadIcon />}
              >
                {t('export')}
              </Button>
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
