import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import {
  AppSnackbar,
  ConfirmDialog,
  DataGridTable,
  Loading,
} from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useDeleteRetriever, useGetVectorStores } from '../../service';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import type { ChromaRetriever } from '../../@types/entities';
import VectorStoreDetailDialog from './VectorStoreDetail';

const VectorStoreManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openVectorStoreDetailDialog, setOpenVectorStoreDetailDialog] =
    useState(false);
  const [vectorStoreIdToDelete, setVectorStoreIdToDelete] = useState<
    string | null
  >(null);
  const [viewedVectorStore, setViewedVectorStore] =
    useState<ChromaRetriever | null>(null);

  // Fetch all prompts
  const [vectorStoreQuery] = useState<GetVectorStoreQuery>({
    offset: 0,
    limit: 40,
  });
  const vectorStores = useGetVectorStores(vectorStoreQuery!, {
    skip: !vectorStoreQuery,
  });
  useEffect(() => {
    if (vectorStores.isError) {
      setSnackbarMessage(t('vectorStoresLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [vectorStores.isError, t]);

  const [rows, setRows] = useState<ChromaRetriever[]>([]);
  useEffect(() => {
    if (vectorStores.data?.content) {
      const mappedRows: ChromaRetriever[] = vectorStores.data.content.map(
        (store) => ({
          ...store,
          id: store.id,
        })
      );
      setRows(mappedRows);
    }
  }, [vectorStores.data, t]);

  const columns: GridColDef<ChromaRetriever>[] = [
    {
      field: 'name',
      headerName: t('vectorStoreName'),
      type: 'string',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'weight',
      headerName: t('weight'),
      type: 'string',
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'mode',
      headerName: t('mode'),
      type: 'string',
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'collection_name',
      headerName: t('collectionName'),
      type: 'string',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'database',
      headerName: t('database'),
      type: 'string',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 180,
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
            setViewedVectorStore(params.row);
            setOpenVectorStoreDetailDialog(true);
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
              RoutePaths.UPDATE_VECTOR_STORE.replace(
                `:${PathHolders.VECTOR_STORE_ID}`,
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
          onClick={() => handleDeleteStore(params.row.id)}
        />,
      ],
    },
  ];

  //delete VectorStore
  const [deleteVectorStoreTrigger, deleteVectorStore] = useDeleteRetriever();
  useEffect(() => {
    if (deleteVectorStore.isError) {
      setSnackbarMessage(t('deleteStoreFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteVectorStore.isSuccess) {
      setSnackbarMessage(t('deleteStoreSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteVectorStore.isError, deleteVectorStore.isSuccess, t]);

  const handleDeleteStore = (storeId: string) => {
    setVectorStoreIdToDelete(storeId);
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
      {vectorStoreIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setVectorStoreIdToDelete(null)}
          title={t('confirmStoreDeleteTitle')}
          message={t('deleteStoreConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteVectorStoreTrigger(vectorStoreIdToDelete);
            setVectorStoreIdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('vectorStoreList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_VECTOR_STORE)}
        >
          {t('createVectorStore')}
        </Button>
      </Box>
      {vectorStores.isLoading ||
      vectorStores.isFetching ||
      deleteVectorStore.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}

      <VectorStoreDetailDialog
        open={openVectorStoreDetailDialog}
        onExit={() => setOpenVectorStoreDetailDialog(false)}
        vectorStore={viewedVectorStore}
      />
    </Stack>
  );
};

export default VectorStoreManagementPage;
