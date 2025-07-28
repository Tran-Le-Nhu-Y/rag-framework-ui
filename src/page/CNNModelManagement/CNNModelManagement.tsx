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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CNNModelDetailDialog from './CNNModelDetail';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import {
  useDeleteRecognizer,
  useGetRecognizer,
  useGetRecognizerById,
} from '../../service';
import type { ImageRecognizer } from '../../@types/entities';

const CNNModelManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [recognizerIdToDelete, setRecognizerIdToDelete] = useState<
    string | null
  >(null);
  const [openRecognizerDetailDialog, setOpenRecognizerDetailDialog] =
    useState(false);
  const [selectedRecognizerlId, setSelectedRecognizerId] = useState<
    string | null
  >(null);
  const [viewedRecognizer, setViewedRecognizer] =
    useState<ImageRecognizer | null>(null);

  const recognizerDetail = useGetRecognizerById(selectedRecognizerlId!, {
    skip: !selectedRecognizerlId,
  });
  useEffect(() => {
    if (recognizerDetail.data) {
      setViewedRecognizer(recognizerDetail.data);
      setOpenRecognizerDetailDialog(true);
    }
  }, [recognizerDetail.data]);
  const columns: GridColDef<ImageRecognizer>[] = [
    {
      field: 'name',
      headerName: t('recognitionModelName'),
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'min_probability',
      headerName: t('minProbability'),
      width: 150,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'max_results',
      headerName: t('maxResults'),
      width: 150,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'output_classes',
      headerName: t('outputClasses'),
      width: 300,
      headerAlign: 'center',
      renderCell: (params) =>
        (params.value as { name: string; description: string }[])
          .map((cls) => `${cls.name} (${cls.description})`)
          .join(', '),
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
          onClick={() => setSelectedRecognizerId(params.row.id)}
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
              RoutePaths.UPDATE_CNN.replace(
                `:${PathHolders.CNN_ID}`,
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
          onClick={() => handleDeleteRecognizer(params.row.id)}
        />,
      ],
    },
  ];

  // Fetch all prompts
  const [recognizersQuery] = useState<GetImageRecognizerQuery>({
    offset: 0,
    limit: 40,
  });
  const recognizers = useGetRecognizer(recognizersQuery!, {
    skip: !recognizersQuery,
  });
  useEffect(() => {
    if (recognizers.isError) {
      setSnackbarMessage(t('cnnLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [recognizers.isError, t]);

  const [rows, setRows] = useState<ImageRecognizer[]>([]);
  useEffect(() => {
    if (recognizers.data?.content) {
      const mappedRows: ImageRecognizer[] = recognizers.data.content.map(
        (recognizer) => ({
          id: recognizer.id,
          name: recognizer.name,
          min_probability: recognizer.min_probability,
          model_file_id: recognizer.model_file_id,
          output_classes: recognizer.output_classes,
          preprocessing_configs: recognizer.preprocessing_configs,
          type: recognizer.type,
          max_results: recognizer.max_results,
        })
      );
      setRows(mappedRows);
    }
  }, [recognizers.data, t]);

  //delete cnn model
  const [deleteRecognizerTrigger, deleteRecognizer] = useDeleteRecognizer();
  useEffect(() => {
    if (deleteRecognizer.isError) {
      setSnackbarMessage(t('deleteCNNFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteRecognizer.isSuccess) {
      setSnackbarMessage(t('deleteCNNSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteRecognizer.isError, deleteRecognizer.isSuccess, t]);

  const handleDeleteRecognizer = (recognizerId: string) => {
    setRecognizerIdToDelete(recognizerId);
  };

  return (
    <Stack justifyContent="center" alignItems="center" spacing={2}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      {recognizerIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setRecognizerIdToDelete(null)}
          title={t('confirmCNNDeleteTitle')}
          message={t('deleteCNNConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteRecognizerTrigger(recognizerIdToDelete);
            setRecognizerIdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('recognitionModelList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_CNN)}
        >
          {t('createRecognitionModel')}
        </Button>
      </Box>

      {recognizers.isLoading ||
      recognizers.isFetching ||
      deleteRecognizer.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}
      <CNNModelDetailDialog
        open={openRecognizerDetailDialog}
        recognizer={viewedRecognizer}
        onExit={() => setOpenRecognizerDetailDialog(false)}
      />
    </Stack>
  );
};

export default CNNModelManagementPage;
