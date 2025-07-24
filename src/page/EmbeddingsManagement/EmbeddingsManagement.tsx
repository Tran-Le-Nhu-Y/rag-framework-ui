import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, ConfirmDialog, DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import { useEffect, useState } from 'react';
import {
  useDeleteEmbeddingModel,
  useGetEmbeddingById,
  useGetEmbeddings,
} from '../../service';
import EmbeddingsDetailDialog from './EmbeddingModelDetail';
import type { Embeddings } from '../../@types/entities';

const EmbeddingsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [embeddingModelIdToDelete, setEmbeddingModelIdToDelete] = useState<
    string | null
  >(null);
  const [openEmbeddingModelDetailDialog, setOpenEmbeddingModelDetailDialog] =
    useState(false);
  const [selectedEmbeddingModelId, setSelectedEmbeddingModelId] = useState<
    string | null
  >(null);
  const [viewedEmbeddingModel, setViewedEmbeddingModel] =
    useState<Embeddings | null>(null);

  const embeddingModelDetail = useGetEmbeddingById(selectedEmbeddingModelId!, {
    skip: !selectedEmbeddingModelId,
  });
  useEffect(() => {
    if (embeddingModelDetail.data) {
      setViewedEmbeddingModel(embeddingModelDetail.data);
      setOpenEmbeddingModelDetailDialog(true);
    }
  }, [embeddingModelDetail.data]);

  const columns: GridColDef<Embeddings>[] = [
    {
      field: 'name',
      headerName: t('embeddingModelName'),
      type: 'string',
      width: 250,
    },
    {
      field: 'model_name',
      headerName: t('modelName'),
      type: 'string',
      width: 250,
    },
    {
      field: 'type',
      headerName: t('embeddingType'),
      type: 'string',
      width: 200,
    },
    {
      field: 'task_type',
      headerName: t('taskType'),
      type: 'string',
      width: 250,
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon />
            </Tooltip>
          }
          color="primary"
          label={t('see')}
          onClick={() => {
            setSelectedEmbeddingModelId(params.row.id);
          }}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() =>
            navigate(
              RoutePaths.UPDATE_EMBEDDINGS.replace(
                `:${PathHolders.EMBEDDING_MODEL_ID}`,
                params.row.id
              )
            )
          }
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={() => handleDeleteChatModel(params.row.id)}
        />,
      ],
    },
  ];
  const [rows, setRows] = useState<Embeddings[]>([]);
  const [embeddingModelQuery] = useState<GetEmbeddingsQuery>({
    offset: 0,
    limit: 40,
  });
  const embeddingModel = useGetEmbeddings(embeddingModelQuery!, {
    skip: !embeddingModelQuery,
  });
  useEffect(() => {
    if (embeddingModel.data?.content) {
      setRows(embeddingModel.data.content);
    }
    if (embeddingModel.isError) {
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [embeddingModel.data?.content, embeddingModel.isError, t]);

  //delete chat model
  const [deleteEmbeddingModelTrigger, deleteEmbeddingModel] =
    useDeleteEmbeddingModel();
  useEffect(() => {
    if (deleteEmbeddingModel.isError) {
      setSnackbarMessage(t('deleteEmbeddingModelFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteEmbeddingModel.isSuccess) {
      setSnackbarMessage(t('deleteEmbeddingModelSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteEmbeddingModel.isError, deleteEmbeddingModel.isSuccess, t]);

  const handleDeleteChatModel = (embeddingModelId: string) => {
    setEmbeddingModelIdToDelete(embeddingModelId);
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      {embeddingModelIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setEmbeddingModelIdToDelete(null)}
          title={t('confirmEmbeddingModelDeleteTitle')}
          message={t('deleteEmbeddingModelConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteEmbeddingModelTrigger(embeddingModelIdToDelete);
            setEmbeddingModelIdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('embeddingModelList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_EMBEDDINGS)}
        >
          {t('embeddingCreation')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
      <EmbeddingsDetailDialog
        open={openEmbeddingModelDetailDialog}
        onExit={() => {
          setOpenEmbeddingModelDetailDialog(false);
          setSelectedEmbeddingModelId(null);
          setViewedEmbeddingModel(null);
        }}
        embeddingModel={viewedEmbeddingModel}
      />
    </Stack>
  );
};

export default EmbeddingsManagementPage;
