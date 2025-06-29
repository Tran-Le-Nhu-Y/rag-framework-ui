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

export default function PromptDetailDialog({
  open,
  promptName = '',
  promptDescription = '',
  promptContent = '',
  onExit,
}: {
  open: boolean;
  promptName?: string;
  promptDescription?: string;
  promptContent?: string;
  onExit: () => void;
  onExport: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('promptDetailInformation')}</Typography>
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
                {t('promptName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {promptName || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('promptDescription')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {promptDescription || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('promptContent')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {promptContent || 'N/A'}
              </Typography>
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
