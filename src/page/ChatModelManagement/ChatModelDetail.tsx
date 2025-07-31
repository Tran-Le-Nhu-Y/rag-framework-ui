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
import type { ChatModel } from '../../@types/entities';

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
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('chatModelDetailInformation')}</Typography>
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
                  {chatModel.model_name || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('modelType')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.type || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('topK')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.top_k || 'N/A'}
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
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('temperature')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.temperature || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('topP')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.top_p || 'N/A'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          {chatModel.type === 'ollama' && (
            <Stack spacing={2} width="100%">
              <Stack direction={'row'} spacing={2} width="100%">
                <Stack spacing={2} width="100%">
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      {t('numCtx')}:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {chatModel.num_ctx || 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      {t('repeatPenalty')}:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {chatModel.repeat_penalty || 'N/A'}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack spacing={2} width="100%">
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      {t('seed')}:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {chatModel.seed || 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      {t('numPredict')}:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {chatModel.num_predict || 'N/A'}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('baseURL')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.base_url || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('stop')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.stop || 'N/A'}
                </Typography>
              </Stack>
            </Stack>
          )}

          {chatModel.type === 'google_genai' && (
            <Stack spacing={2} width="100%">
              <Stack direction={'row'} spacing={2} width="100%">
                <Stack spacing={2} width="100%">
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      {t('maxTokens')}:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {chatModel.max_tokens || 'N/A'}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack spacing={2} width="100%">
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      {t('timeout')}:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {chatModel.timeout || 'N/A'}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('maxRetries')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {chatModel.max_retries || 'N/A'}
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('safetySettings')}:
              </Typography>
              <Box sx={{ pl: 2 }}>
                {chatModel.safety_settings &&
                  Object.entries(chatModel.safety_settings).map(
                    ([key, value]) => (
                      <Box
                        key={key}
                        display="flex"
                        alignItems="flex-start"
                        gap={1}
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          • {key} :
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    )
                  )}
              </Box>
            </Stack>
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
