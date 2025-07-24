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
import type { Embeddings } from '../../@types/entities';

export default function EmbeddingsDetailDialog({
  open,
  embeddingModel,
  onExit,
}: {
  open: boolean;
  embeddingModel: Embeddings | null;
  onExit: () => void;
}) {
  const { t } = useTranslation();
  if (!embeddingModel) return null;
  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('embeddingModelInfo')}</Typography>
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
                  {t('embeddingModelName')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {embeddingModel.name || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('modelName')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {embeddingModel.model_name || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('embeddingType')}:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {embeddingModel.type || 'N/A'}
                </Typography>
              </Stack>
              {embeddingModel.type === 'google_genai' && (
                <Stack direction={'row'} spacing={1}>
                  <Typography variant="body1" fontWeight={'bold'}>
                    {t('taskType')}:
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {embeddingModel.task_type || 'N/A'}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
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
