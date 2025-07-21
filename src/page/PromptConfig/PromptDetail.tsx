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
  prompt,
  onExit,
}: {
  open: boolean;
  prompt: Prompt | null;
  onExit: () => void;
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
            <Typography variant="body1" fontWeight={'bold'}>
              {t('suggest_questions_prompt')}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {prompt?.suggest_questions_prompt || 'N/A'}
            </Typography>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('respond_prompt')}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {prompt?.respond_prompt || 'N/A'}
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
