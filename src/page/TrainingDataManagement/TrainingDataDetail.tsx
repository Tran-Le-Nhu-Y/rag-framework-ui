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

export default function TrainingDataDetailDialog({
  open,
  onExit,
  trainingDataName = '',
  trainingDataDescription = '',
}: {
  open: boolean;
  onExit: () => void;
  trainingDataName?: string;
  trainingDataDescription?: string;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('trainingDataDetail')}</Typography>
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
                {t('trainingDataName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trainingDataName || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('trainingDataDescription')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trainingDataDescription || 'N/A'}
              </Typography>
            </Stack>

            <Typography variant="body1" fontWeight={'bold'}>
              {t('trainingDataFile')}:
            </Typography>

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
