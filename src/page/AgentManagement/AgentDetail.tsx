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

export default function AgentDetailDialog({
  open,
  onExit,
  agentName = '',
  agentDescription = '',
}: {
  open: boolean;
  onExit: () => void;
  agentName?: string;
  agentDescription?: string;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('agentDetailInformation')}</Typography>
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
                {t('agentName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {agentName || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={2}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('agentDescription')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {agentDescription || 'N/A'}
              </Typography>
            </Stack>

            <Typography variant="body1" fontWeight={'bold'}>
              {t('configFile')}:
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
