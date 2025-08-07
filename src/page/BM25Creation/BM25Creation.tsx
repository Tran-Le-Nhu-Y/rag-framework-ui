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
import {
  useCreateBM25,
  useDeleteFile,
  useGetEmbeddings,
  usePostFile,
} from '../../service';
import { AppSnackbar, InputFileUpload, SelectForm } from '../../component';
import type { BM25Retriever, Embeddings } from '../../@types/entities';
import type { Data } from '../../component/SelectForm';

export default function BM25CreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  const [postFile] = usePostFile();
  const [bm25, setBM25] = useState<BM25Retriever>({
    id: '',
    name: '',
    weight: 0,
    k: 4,
    type: 'bm25',
    embeddings_id: '',
    enable_remove_emoji: false,
    enable_remove_emoticon: false,
    removal_words_file_id: '',
  });

  const [createBM25Trigger, createBM25] = useCreateBM25();
  const handleCreateBM25Submit = async () => {
    // Validate required fields
    const validate = () => {
      if (!bm25.name.trim()) {
        setSnackbarMessage(t('bm25NameRequired'));
        setSnackbarSeverity(SnackbarSeverity.WARNING);
        setSnackbarOpen(true);
        return false;
      }

      if (!bm25.embeddings_id) {
        setSnackbarMessage(t('embeddingRequired'));
        setSnackbarSeverity(SnackbarSeverity.WARNING);
        setSnackbarOpen(true);
        return false;
      }
      if (bm25.weight > 1) {
        setSnackbarMessage(t('bm25WeightInvalid'));
        setSnackbarSeverity(SnackbarSeverity.WARNING);
        setSnackbarOpen(true);
        return false;
      }

      return true;
    };

    if (!validate()) return;

    try {
      const newBM25: CreateBM25RetrieverRequest = {
        name: bm25.name,
        embeddings_id: bm25.embeddings_id,
        type: bm25.type,
        weight: bm25.weight,
        enable_remove_emoji: bm25.enable_remove_emoji,
        enable_remove_emoticon: bm25.enable_remove_emoticon,
        k: bm25.k,
        removal_words_file_id: bm25.removal_words_file_id,
      };

      await createBM25Trigger(newBM25);
      setSnackbarMessage(t('createBM25Success'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.BM25);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('createBM25Failed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
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
      setSnackbarMessage(t('embeddingModelsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [embeddingModel.data?.content, embeddingModel.isError, t]);

  const [deleteFileTrigger] = useDeleteFile();

  return (
    <Stack spacing={1}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography sx={{ textAlign: 'center' }} variant="h4" pb={2}>
        {t('createBM25')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="80%">
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <TextField
              fullWidth
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('bm25Name')}
              value={bm25.name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setBM25((prev) => ({
                    ...prev,
                    name: newValue,
                  }));
              }}
              placeholder={`${t('enter')} ${t('bm25Name').toLowerCase()}...`}
            />
            <Tooltip title={t('weightTooltip')} placement="top">
              <TextField
                fullWidth
                size="small"
                label={t('weight')}
                type="number"
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.1,
                }}
                value={bm25.weight}
                onChange={(e) =>
                  setBM25((prev) => ({
                    ...prev,
                    weight: Number(e.target.value),
                  }))
                }
                placeholder={`${t('enter')} ${t('weight').toLowerCase()}...`}
              />
            </Tooltip>
          </Stack>

          <Stack spacing={2} direction={'row'} width={'100%'}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('k')}
              value={bm25.k}
              onChange={(e) =>
                setBM25((prev) => ({
                  ...prev,
                  k: Number(e.target.value),
                }))
              }
              placeholder={`${t('enter')} ${t('k').toLowerCase()}...`}
            />

            <SelectForm
              label={t('embeddingModel')}
              dataList={embeddingList}
              value={
                embeddingList.find(
                  (item) => item.value === bm25.embeddings_id
                ) || null
              }
              isClearable={false}
              onChange={(selected) => {
                setBM25((prev) => ({
                  ...prev,
                  embeddings_id: (selected as Data).value,
                }));
              }}
            />
          </Stack>
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <FormControlLabel
              control={
                <Switch
                  checked={bm25.enable_remove_emoji ?? false}
                  onChange={(e) => {
                    setBM25((prev) => ({
                      ...prev,
                      enable_remove_emoji: e.target.checked,
                    }));
                  }}
                />
              }
              label={t('enable_remove_emoji')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={bm25.enable_remove_emoticon ?? false}
                  onChange={(e) => {
                    setBM25((prev) => ({
                      ...prev,
                      enable_remove_emoticon: e.target.checked,
                    }));
                  }}
                />
              }
              label={t('enable_remove_emoticon')}
            />
          </Stack>

          <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
            <Typography variant="body1">
              {t('removal_words_file_upload')}:
            </Typography>
            <InputFileUpload
              onFilesChange={async (files: File[]) => {
                if (!files || files.length === 0) {
                  return;
                }
                const file = files[0];

                try {
                  const uploadedFileId = await postFile({ file }).unwrap(); // get fileId from server
                  console.log('Uploaded file ID:', uploadedFileId);
                  setBM25((prev) => ({
                    ...prev,
                    removal_words_file_id: uploadedFileId,
                  }));
                } catch (error) {
                  console.error('Upload file failed:', error);
                  setSnackbarMessage(t('uploadFileFailed'));
                  setSnackbarSeverity(SnackbarSeverity.ERROR);
                  setSnackbarOpen(true);
                }
              }}
              onFileRemove={async () => {
                if (bm25.removal_words_file_id) {
                  try {
                    await deleteFileTrigger(
                      bm25.removal_words_file_id
                    ).unwrap();
                    setBM25((prev) => ({
                      ...prev,
                      removal_words_file_id: '',
                    }));
                  } catch (error) {
                    console.error('Delete file failed:', error);
                    setSnackbarMessage(t('deleteFileFailed'));
                    setSnackbarSeverity(SnackbarSeverity.ERROR);
                    setSnackbarOpen(true);
                  }
                }
              }}
              acceptedFileTypes={['.txt']}
            />
          </Box>

          <Box display="flex" justifyContent="center" gap={2} pt={2}>
            <Button
              variant="contained"
              color="primary"
              loading={createBM25.isLoading}
              disabled={createBM25.isSuccess}
              onClick={() => handleCreateBM25Submit()}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.BM25)}
              disabled={createBM25.isSuccess || createBM25.isLoading}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
