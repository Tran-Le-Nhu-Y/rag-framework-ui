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
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useNavigate, useParams } from 'react-router';
import {
  useDeleteFile,
  useGetBM25ById,
  useGetEmbeddings,
  useGetFileById,
  usePostFile,
  useUpdateBM25,
} from '../../service';
import {
  AppSnackbar,
  InputFileUpload,
  Loading,
  SelectForm,
} from '../../component';
import type {
  BM25Retriever,
  Embeddings,
  File as ServerFile,
} from '../../@types/entities';
import type { Data } from '../../component/SelectForm';
import { FilePreviewCard } from '../../component/FilePreviewCard';

export default function BM25UpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bm25Id = useParams()[PathHolders.BM25_ID];
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

  //Get BM25 detail
  const bm25Detail = useGetBM25ById(bm25Id!, {
    skip: !bm25Id,
  });
  useEffect(() => {
    if (bm25Detail.data) {
      setBM25((prev) => ({
        ...prev,
        ...bm25Detail.data,
      }));
    }
    if (bm25Detail.isError) {
      setSnackbarMessage(t('bm25LoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [bm25Detail.data, bm25Detail.isError, t]);

  //Get File Information
  const fileId = bm25?.removal_words_file_id;
  const shouldFetchFile = !!fileId && fileId !== '';
  const fileDetail = useGetFileById(fileId!, {
    skip: !shouldFetchFile,
  });
  useEffect(() => {
    if (fileDetail.isError) {
      setSnackbarMessage(t('fileLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [fileDetail, fileDetail.isError, t]);
  // Thêm state để giữ file hiển thị
  const [fileData, setFileData] = useState<ServerFile | null>(null);
  useEffect(() => {
    if (fileDetail.data) setFileData(fileDetail.data);
  }, [fileDetail.data]);

  // Handle Update
  const [updateBM25Trigger, updateBM25] = useUpdateBM25();
  const oldFileIdToDelete = fileDetail.data?.id;
  const [newFile, setNewFile] = useState<File | null>(null); // New File => upload
  const [isRemoveOldFile, setIsRemoveOldFile] = useState(false); // remove file
  const [deleteFileTrigger] = useDeleteFile();
  const handleUpdateBM25Submit = async () => {
    // Validate required fields
    if (!bm25.name.trim()) {
      setSnackbarMessage(t('bm25NameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    if (!bm25.embeddings_id) {
      setSnackbarMessage(t('embeddingRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    try {
      let updatedFileId = bm25.removal_words_file_id;
      // Step 1: Delete old file (if any)
      if (isRemoveOldFile && oldFileIdToDelete) {
        await deleteFileTrigger(oldFileIdToDelete!).unwrap();
        updatedFileId = '';
      }

      // Step 2: Upload new file (if any)
      if (newFile) {
        updatedFileId = await postFile({ file: newFile }).unwrap();
      }

      // Step 3: Update
      const payload: UpdateBM25RetrieverRequest = {
        id: bm25Id!,
        name: bm25.name,
        embeddings_id: bm25.embeddings_id,
        type: bm25.type,
        weight: bm25.weight,
        enable_remove_emoji: bm25.enable_remove_emoji,
        enable_remove_emoticon: bm25.enable_remove_emoticon,
        k: bm25.k,
        removal_words_file_id: updatedFileId,
      };

      await updateBM25Trigger(payload);
      setSnackbarMessage(t('updateBM25Success'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.BM25);
      }, 500);
      // Reset file state
      setIsRemoveOldFile(false);
      setNewFile(null);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('updateBM25Failed'));
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
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [embeddingModel.data?.content, embeddingModel.isError, t]);

  if (bm25Detail.isLoading || embeddingModel.isLoading) return <Loading />;
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
        {t('updateBM25')}
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
                value={bm25.weight ?? 0}
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
            {fileDetail.isLoading ? (
              <Typography variant="body1">{t('loading')}</Typography>
            ) : fileData ? (
              <>
                <FilePreviewCard
                  file={fileData}
                  onDelete={() => {
                    setIsRemoveOldFile(true);
                    setBM25((prev) => ({
                      ...prev,
                      removal_words_file_id: '',
                    }));
                    setFileData(null); // Rerender UI
                  }}
                />
              </>
            ) : (
              <InputFileUpload
                onFilesChange={(files) => {
                  if (!files || files.length === 0) return;
                  setNewFile(files[0]);
                  setIsRemoveOldFile(true); // Khi chọn file mới thì đánh dấu xoá file cũ
                  setBM25((prev) => ({
                    ...prev,
                    removal_words_file_id: '',
                  }));
                }}
                onFileRemove={() => {
                  setIsRemoveOldFile(true); // Nếu nhấn nút xoá file cũ
                  setNewFile(null);
                }}
                acceptedFileTypes={['.txt']}
              />
            )}
          </Box>

          <Box display="flex" justifyContent="center" gap={2} pt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdateBM25Submit()}
              loading={updateBM25.isLoading}
              disabled={updateBM25.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.BM25)}
              disabled={updateBM25.isLoading || updateBM25.isSuccess}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
