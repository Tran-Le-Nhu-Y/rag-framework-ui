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
import { useEffect, useMemo, useState } from 'react';
import { useDeleteRetriever, useGetBM25s } from '../../service';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import type { BM25Retriever } from '../../@types/entities';
import BM25DetailDialog from './BM25Detail';

const BM25ManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openBM25DetailDialog, setOpenBM25DetailDialog] = useState(false);
  const [bm25IdToDelete, setBM25IdToDelete] = useState<string | null>(null);
  const [viewedBM25, setViewedBM25] = useState<BM25Retriever | null>(null);

  // Fetch all bm25s
  const [bm25Query] = useState<GetBM25Query>({
    offset: 0,
    limit: 40,
  });
  const bm25s = useGetBM25s(bm25Query!, {
    skip: !bm25Query,
  });
  useEffect(() => {
    if (bm25s.isError) {
      setSnackbarMessage(t('bm25sLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [bm25s.isError, t]);

  const rows = useMemo(() => {
    if (bm25s.isError) return [];
    if (bm25s.data?.content)
      return bm25s.data.content.map(
        (bm25) =>
          ({
            ...bm25,
            id: bm25.id,
          } as BM25Retriever)
      );
    else return [];
  }, [bm25s.data?.content, bm25s.isError]);

  const columns: GridColDef<BM25Retriever>[] = [
    {
      field: 'name',
      headerName: t('bm25Name'),
      type: 'string',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'weight',
      headerName: t('weight'),
      type: 'string',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'enable_remove_emoji',
      headerName: t('enable_remove_emoji'),
      type: 'string',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography>{params.value ? t('true') : t('false')}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'enable_remove_emoticon',
      headerName: t('enable_remove_emoticon'),
      type: 'string',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography>{params.value ? t('true') : t('false')}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 250,
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
            setViewedBM25(params.row);
            setOpenBM25DetailDialog(true);
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
              RoutePaths.UPDATE_BM25.replace(
                `:${PathHolders.BM25_ID}`,
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
          onClick={() => handleDeleteBM25(params.row.id)}
        />,
      ],
    },
  ];

  //delete bm25
  const [deleteBM25Trigger, deleteBM25] = useDeleteRetriever();
  useEffect(() => {
    if (deleteBM25.isError) {
      setSnackbarMessage(t('deleteBM25Failed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteBM25.isSuccess) {
      setSnackbarMessage(t('deleteBM25Success'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteBM25.isError, deleteBM25.isSuccess, t]);

  const handleDeleteBM25 = (bm25Id: string) => {
    setBM25IdToDelete(bm25Id);
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
      {bm25IdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setBM25IdToDelete(null)}
          title={t('confirmBM25DeleteTitle')}
          message={t('deleteBM25Confirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteBM25Trigger(bm25IdToDelete);
            setBM25IdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('bm25Management')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_BM25)}
        >
          {t('createBM25')}
        </Button>
      </Box>
      {bm25s.isLoading || bm25s.isFetching || deleteBM25.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}

      <BM25DetailDialog
        open={openBM25DetailDialog}
        onExit={() => setOpenBM25DetailDialog(false)}
        bm25={viewedBM25}
      />
    </Stack>
  );
};

export default BM25ManagementPage;
