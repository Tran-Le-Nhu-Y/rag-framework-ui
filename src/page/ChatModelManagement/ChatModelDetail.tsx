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
import GoogleGenAIDetail from './components/GoogleGenAIDetail';
import OllamaDetail from './components/OllamaDetail';

export default function ChatModelDetailDialog({
  open,
  chatModel,
  onExit,
}: {
  open: boolean;
  chatModel: ChatModel | null;
  onExit: () => void;
}) {
  const { t } = useTranslation();
  if (!chatModel) return null;
  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }} variant="h4">
        {t('chatModelDetailInformation')}
      </DialogTitle>
      <DialogContent>
        <Stack
          justifyContent={'center'}
          alignItems="center"
          spacing={2}
          sx={{ mt: 1, mb: 1 }}
        >
          <Stack direction={'row'} spacing={2} width="100%">
            <Stack spacing={2} width="100%">
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('modelName')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.modelName || 'N/A'}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={2} width="100%">
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('modelType')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.type || 'N/A'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          {chatModel.type === 'ollama' && (
            <OllamaDetail chatModel={chatModel} />
          )}

          {chatModel.type === 'google_genai' && (
            <GoogleGenAIDetail chatModel={chatModel} />
          )}
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button variant="outlined" color="info" onClick={onExit}>
              {t('exit')}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
