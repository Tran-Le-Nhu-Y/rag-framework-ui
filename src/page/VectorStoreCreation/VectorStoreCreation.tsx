import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  HideDuration,
  isValidLength,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useNavigate } from 'react-router';
import { useCreateVectorStore, useGetEmbeddings } from '../../service';
import { AppSnackbar, SelectForm } from '../../component';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { ChromaRetriever, Embeddings } from '../../@types/entities';
import type { Data } from '../../component/SelectForm';

const modeList: Data[] = [
  { label: 'Persistent', value: 'persistent' },
  { label: 'Remote', value: 'remote' },
];

export default function VectorStoreCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [vectorStore, setVectorStore] = useState<ChromaRetriever>({
    id: '',
    name: '',
    weight: 0,
    mode: 'persistent',
    connection: {
      host: 'localhost',
      port: 8000,
      ssl: false,
      headers: null,
    },
    collection_name: 'agent_collection',
    k: 4,
    tenant: 'default_tenant',
    database: 'default_database',
    type: 'chroma_db',
    embeddings_id: '',
  });

  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

  // header =>  object
  const headerObject = headers.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const [createVectorStoreTrigger, createVectorStore] = useCreateVectorStore();
  const handleCreateVectorStoreSubmit = async () => {
    // Validate required fields
    if (!vectorStore.name.trim()) {
      setSnackbarMessage(t('storeNameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (vectorStore.weight > 1) {
      setSnackbarMessage(t('weightInvalid'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (!vectorStore.embeddings_id) {
      setSnackbarMessage(t('embeddingRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    try {
      const connection =
        vectorStore.mode === 'remote' && vectorStore.connection
          ? {
              ...vectorStore.connection!,
              headers: headerObject,
            }
          : undefined; // connection === remote

      const newStore: CreateChromaRetrieverRequest = {
        name: vectorStore.name,
        embeddings_id: vectorStore.embeddings_id,
        type: vectorStore.type,
        database: vectorStore.database,
        collection_name: vectorStore.collection_name,
        tenant: vectorStore.tenant,
        weight: vectorStore.weight,
        k: vectorStore.k,
        mode: vectorStore.mode,
        ...(connection && { connection }),
      };

      await createVectorStoreTrigger(newStore).unwrap();
      setSnackbarMessage(t('createStoreSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.VECTOR_STORE);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('createStoreFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleHeaderChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  //get all embedding model
  const [embeddingList, setEmbeddingList] = useState<Data[]>([]);
  const [embeddingModelQuery] = useState<GetEmbeddingsQuery>({
    offset: 0,
    limit: 40,
  });
  const embeddingModel = useGetEmbeddings(embeddingModelQuery!, {
    skip: !embeddingModelQuery,
  });
  useEffect(() => {
    if (embeddingModel.data?.content) {
      const mappedList: Data[] = embeddingModel.data.content.map(
        (item: Embeddings) => ({
          label: item.name,
          value: item.id,
        })
      );
      setEmbeddingList(mappedList);
    }
    if (embeddingModel.isError) {
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [embeddingModel.data?.content, embeddingModel.isError, t]);

  return (
    <Stack>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography sx={{ textAlign: 'center' }} variant="h4" pb={2}>
        {t('createVectorStore')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="80%">
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <TextField
              required
              fullWidth
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('vectorStoreName')}
              value={vectorStore.name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setVectorStore((prev) => ({
                    ...prev,
                    name: newValue,
                  }));
              }}
              placeholder={`${t('enter')} ${t(
                'vectorStoreName'
              ).toLowerCase()}...`}
            />

            <SelectForm
              label={t('mode')}
              dataList={modeList}
              value={
                modeList.find((item) => item.value === vectorStore.mode) || null
              }
              isClearable={false}
              onChange={(selected) => {
                const mode = (selected as Data).value;

                setVectorStore((prev) => {
                  const updatedStore = {
                    ...prev,
                    mode,
                  };

                  if (mode === 'persistent') {
                    delete updatedStore.connection;
                  } else if (mode === 'remote') {
                    updatedStore.connection = {
                      host: 'localhost',
                      port: 8000,
                      ssl: false,
                      headers: null,
                    };
                  }

                  return updatedStore;
                });
              }}
            />
          </Stack>

          {vectorStore.mode === 'remote' && (
            <Stack
              spacing={1}
              sx={{
                border: '2px dashed ',
                p: 2,
                borderColor: 'grey.500',
                borderRadius: 5,
              }}
            >
              <Stack spacing={2} direction={'row'} width={'100%'}>
                <TextField
                  fullWidth
                  size="small"
                  label={t('host')}
                  value={vectorStore.connection?.host ?? ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (isValidLength(newValue, TextLength.MEDIUM))
                      setVectorStore((prev) => ({
                        ...prev,
                        connection: {
                          ...prev.connection!,
                          host: newValue,
                        },
                      }));
                  }}
                  placeholder={`${t('enter')} ${t('host').toLowerCase()}...`}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  placeholder={`${t('enter')} ${t('port').toLowerCase()}...`}
                  label={t('port')}
                  value={vectorStore.connection?.port ?? ''}
                  onChange={(e) => {
                    const newPort = parseInt(e.target.value, 10) || 0;
                    setVectorStore((prev) => ({
                      ...prev,
                      connection: {
                        ...prev.connection!,
                        port: newPort,
                      },
                    }));
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={vectorStore.connection?.ssl ?? false}
                      onChange={(e) => {
                        const isSSL = e.target.checked;
                        setVectorStore((prev) => ({
                          ...prev,
                          connection: {
                            ...prev.connection!,
                            ssl: isSSL,
                          },
                        }));
                      }}
                    />
                  }
                  label={t('ssl')}
                />
              </Stack>
              <Stack spacing={1} width={'100%'}>
                <Typography variant="subtitle1">{t('headers')}:</Typography>
                {headers.map((header, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    width={'100%'}
                  >
                    <TextField
                      size="small"
                      fullWidth
                      label={t('headerKey')}
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(index, 'key', e.target.value)
                      }
                      placeholder={`${t('enter')} ${t(
                        'headerKey'
                      ).toLowerCase()}...`}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      label={t('headerValue')}
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(index, 'value', e.target.value)
                      }
                      placeholder={`${t('enter')} ${t(
                        'headerValue'
                      ).toLowerCase()}...`}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveHeader(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                ))}

                <Box display="flex" justifyContent="center">
                  <Button variant="contained" onClick={handleAddHeader}>
                    <Tooltip title={t('addHeader')}>
                      <AddCircleIcon />
                    </Tooltip>
                  </Button>
                </Box>
              </Stack>
            </Stack>
          )}

          <Stack spacing={2} direction={'row'} width={'100%'}>
            <Tooltip title={t('weightTooltip')}>
              <TextField
                required
                fullWidth
                size="small"
                label={t('weight')}
                type="number"
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.1,
                }}
                value={vectorStore.weight}
                onChange={(e) =>
                  setVectorStore((prev) => ({
                    ...prev,
                    weight: Number(e.target.value),
                  }))
                }
                placeholder={`${t('enter')} ${t('weight').toLowerCase()}...`}
              />
            </Tooltip>

            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder={`${t('enter')} ${t(
                'collectionName'
              ).toLowerCase()}...`}
              label={t('collectionName')}
              value={vectorStore.collection_name}
              onChange={(e) =>
                setVectorStore((prev) => ({
                  ...prev,
                  collection_name: e.target.value,
                }))
              }
            />
          </Stack>
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('k')}
              value={vectorStore.k}
              onChange={(e) =>
                setVectorStore((prev) => ({
                  ...prev,
                  k: Number(e.target.value),
                }))
              }
              placeholder={`${t('enter')} ${t('k').toLowerCase()}...`}
            />

            <SelectForm
              required
              label={t('embeddingModel')}
              dataList={embeddingList}
              value={
                embeddingList.find(
                  (item) => item.value === vectorStore.embeddings_id
                ) || null
              }
              isClearable={false}
              onChange={(selected) => {
                setVectorStore((prev) => ({
                  ...prev,
                  embeddings_id: (selected as Data).value,
                }));
              }}
            />
          </Stack>
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <Tooltip title={t('tenantTooltip')}>
              <TextField
                fullWidth
                size="small"
                label={t('tenant')}
                value={vectorStore.tenant}
                onChange={(e) =>
                  setVectorStore((prev) => ({
                    ...prev,
                    utenantrl: e.target.value,
                  }))
                }
                placeholder={`${t('enter')} ${t('tenant').toLowerCase()}...`}
              />
            </Tooltip>

            <Tooltip title={t('databaseTooltip')}>
              <TextField
                fullWidth
                size="small"
                type="text"
                placeholder={`${t('enter')} ${t('database').toLowerCase()}...`}
                label={t('database')}
                value={vectorStore.database}
                onChange={(e) =>
                  setVectorStore((prev) => ({
                    ...prev,
                    database: e.target.value,
                  }))
                }
              />
            </Tooltip>
          </Stack>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCreateVectorStoreSubmit()}
              loading={createVectorStore.isLoading}
              disabled={createVectorStore.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              disabled={
                createVectorStore.isSuccess || createVectorStore.isLoading
              }
              onClick={() => navigate(RoutePaths.VECTOR_STORE)}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
