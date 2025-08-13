import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  HideDuration,
  isValidLength,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useNavigate, useParams } from 'react-router';
import { useGetEmbeddingById, useUpdateEmbeddingModel } from '../../service';
import { AppSnackbar, Loading, SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';
import type {
  HuggingFaceEmbeddings,
  GoogleGenAIEmbeddings,
  EmbeddingType,
} from '../../@types/entities';

const typeList: Data[] = [
  { label: 'Hugging Face', value: 'hugging_face' },
  { label: 'Google Gen AI', value: 'google_genai' },
];
const taskTypeList: Data[] = [
  { label: 'Retrieval Query', value: 'retrieval_query' },
  { label: 'Retrieval Document', value: 'retrieval_document' },
  { label: 'Semantic Similarity', value: 'semantic_similarity' },
  { label: 'Classification', value: 'classification' },
  { label: 'Clustering', value: 'clustering' },
];

export default function EmbeddingUpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const embeddingModelId = useParams()[PathHolders.EMBEDDING_MODEL_ID];
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  type EmbeddingModelState =
    | Partial<HuggingFaceEmbeddings>
    | Partial<GoogleGenAIEmbeddings>;
  const [embeddingModel, setEmbeddingModel] = useState<EmbeddingModelState>({});

  const embeddingModelDetail = useGetEmbeddingById(embeddingModelId!, {
    skip: !embeddingModelId,
  });
  useEffect(() => {
    if (embeddingModelDetail.data) {
      const embeddingModel = embeddingModelDetail.data;
      setEmbeddingModel({
        ...embeddingModel,
      });
    }
    if (embeddingModelDetail.isError) {
      setSnackbarMessage(t('embeddingModelLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [embeddingModelDetail.data, embeddingModelDetail.isError, t]);

  const updateEmbeddingModel = (key: string, value: string) => {
    setEmbeddingModel((prev) => ({ ...prev, [key]: value }));
  };

  const [updateEmbeddingModelTrigger, updateEmbedding] =
    useUpdateEmbeddingModel();
  const handleSubmit = async () => {
    if (
      !embeddingModel.name ||
      !embeddingModel.model_name ||
      !embeddingModel.type
    ) {
      setSnackbarMessage(t('missingRequiredFields'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    const payload: UpdateEmbeddingRequest = {
      id: embeddingModelId!,
      name: embeddingModel.name,
      model_name: embeddingModel.model_name,
      type: embeddingModel.type,
      task_type:
        embeddingModel.type === 'google_genai'
          ? embeddingModel.task_type
          : undefined,
    };

    try {
      await updateEmbeddingModelTrigger(payload);
      setSnackbarMessage(t('updateEmbeddingModelSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.EMBEDDINGS);
      }, 500);
    } catch {
      setSnackbarMessage(t('updateEmbeddingModelFail'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };
  if (embeddingModelDetail.isLoading) return <Loading />;
  return (
    <Stack spacing={1}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('embeddingUpdate')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={3} width="80%">
          <Stack spacing={3}>
            <TextField
              required
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('embeddingModelName')}
              value={embeddingModel.name || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  updateEmbeddingModel('name', newValue);
              }}
              placeholder={`${t('enter')} ${t(
                'embeddingModelName'
              ).toLowerCase()}...`}
            />

            <Tooltip title={t('embeddingModelNameTooltip')} placement="top">
              <TextField
                required
                type="text"
                size="small"
                placeholder={`${t('enter')} ${t('modelName').toLowerCase()}...`}
                helperText={t('hyperTextMedium')}
                label={t('modelName')}
                value={embeddingModel.model_name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (isValidLength(newValue, TextLength.MEDIUM))
                    updateEmbeddingModel('model_name', newValue);
                }}
              />
            </Tooltip>
            <SelectForm
              required
              label={t('selectTypeModel')}
              isClearable={false}
              dataList={typeList}
              value={
                typeList.find((item) => item.value === embeddingModel.type) ||
                null
              }
              onChange={(selected) => {
                const selectedValue = (selected as Data | null)
                  ?.value as EmbeddingType;
                updateEmbeddingModel('type', selectedValue);
              }}
            />
            {embeddingModel.type === 'google_genai' && (
              <SelectForm
                label={t('selectTaskType')}
                dataList={taskTypeList}
                value={
                  taskTypeList.find(
                    (item) => item.value === embeddingModel.task_type
                  ) || null
                }
                onChange={(selected) => {
                  updateEmbeddingModel(
                    'task_type',
                    (selected as Data | null)?.value || ''
                  );
                }}
              />
            )}
          </Stack>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              loading={updateEmbedding.isLoading}
              disabled={updateEmbedding.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.EMBEDDINGS)}
              disabled={updateEmbedding.isSuccess || updateEmbedding.isLoading}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
