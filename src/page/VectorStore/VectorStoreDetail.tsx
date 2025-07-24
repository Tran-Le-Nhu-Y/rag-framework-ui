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
import type { ChromaRetriever } from '../../@types/entities';
import { useGetEmbeddingById } from '../../service';
import { AppSnackbar } from '../../component';
import { HideDuration, SnackbarSeverity } from '../../util';
import { useEffect, useState } from 'react';

export default function VectorStoreDetailDialog({
  open,
  vectorStore,
  onExit,
}: {
  open: boolean;
  vectorStore: ChromaRetriever | null;
  onExit: () => void;
}) {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const embeddingModelId = vectorStore?.embeddings_id;
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

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5">
          {t('vectorStoreDetailInformation')}
        </Typography>
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
          <Stack spacing={1} width="100%">
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('vectorStoreName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.name || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('mode')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.mode || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('collectionName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.collection_name || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('embeddingModel')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {embeddingModelDetail.isLoading
                  ? t('loading')
                  : embeddingModelDetail.data?.name || 'N/A'}
                {embeddingModelDetail.isError && (
                  <Typography variant="body2" color="error">
                    {t('embeddingModelLoadingError')}
                  </Typography>
                )}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('weight')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.weight || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('k')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.k || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('tenant')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.tenant || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('database')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {vectorStore?.database || 'N/A'}
              </Typography>
            </Stack>

            {vectorStore?.mode === 'remote' && (
              <Stack spacing={1} width="100%">
                <Typography variant="body1" fontWeight={'bold'}>
                  {t('connection')}:
                </Typography>
                <Stack direction={'row'} spacing={5} pl={3}>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body2" fontWeight={'bold'}>
                      {t('host')}:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {vectorStore?.connection?.host || 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body2" fontWeight={'bold'}>
                      {t('port')}:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {vectorStore?.connection?.port || 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="body2" fontWeight={'bold'}>
                      {t('ssl')}:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {vectorStore?.connection?.ssl === true
                        ? t('true')
                        : t('false')}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" fontWeight={'bold'} sx={{ pl: 3 }}>
                  {t('headers')}:
                </Typography>
                <Box sx={{ pl: 6 }}>
                  {vectorStore?.connection?.headers &&
                    Object.entries(vectorStore?.connection?.headers).map(
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
