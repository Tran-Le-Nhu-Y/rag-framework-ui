import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, ConfirmDialog, DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useNavigate } from 'react-router';
import { HideDuration, RoutePaths, SnackbarSeverity } from '../../util';
import { useEffect, useState } from 'react';
import { useDeleteChatModel, useGetChatModels } from '../../service';

const ChatModelManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [chatModelIdToDelete, setChatModelIdToDelete] = useState<string | null>(
    null
  );

  const columns: GridColDef<BaseChatModel>[] = [
    {
      field: 'model_name',
      headerName: t('modelName'),
      type: 'string',
      width: 250,
      headerAlign: 'center',
    },

    {
      field: 'temperature',
      headerName: t('temperature'),
      type: 'number',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'top_k',
      headerName: t('topK'),
      type: 'number',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'top_p',
      headerName: t('topP'),
      type: 'number',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'type',
      headerName: t('modelType'),
      type: 'string',
      width: 150,
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 250,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('export')}>
              <SimCardDownloadIcon color="primary" />
            </Tooltip>
          }
          label={t('export')}
          onClick={() => {}}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon />
            </Tooltip>
          }
          color="primary"
          label={t('see')}
          onClick={() => navigate('/agent-detail')}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => navigate('/agent-update')}
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
  const [rows, setRows] = useState<ChatModel[]>([]);
  const [chatModelQuery] = useState<GetChatModelsQuery>({
    offset: 0,
    limit: 40,
  });
  const chatModel = useGetChatModels(chatModelQuery!, {
    skip: !chatModelQuery,
  });
  useEffect(() => {
    if (chatModel.data?.content) {
      setRows(chatModel.data.content);
    }
    if (chatModel.isError) {
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [chatModel.data?.content, chatModel.isError, t]);

  //   const [rows, setRows] = useState<ChatModel[]>([]);
  //   useEffect(() => {
  //     if (chatModel.data?.content) {
  //       const mappedRows: ChatModel[] = chatModel.data.content.map(
  //         (chatModel) => ({
  //           id: chatModel.id,
  //           model_name: chatModel.model_name,
  //           temperature: chatModel.temperature,
  //           top_k: chatModel.top_k,
  //           top_p: chatModel.top_p,
  //           type: chatModel.type,
  //         })
  //       );
  //       setRows(mappedRows);
  //     }
  //   }, [chatModel.data, t]);

  //delete chat model
  const [deleteChatModelTrigger, deleteChatModel] = useDeleteChatModel();
  useEffect(() => {
    if (deleteChatModel.isError) {
      setSnackbarMessage(t('deleteChatModelFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteChatModel.isSuccess) {
      setSnackbarMessage(t('deleteChatModelSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteChatModel.isError, deleteChatModel.isSuccess, t]);

  const handleDeleteChatModel = (chatModelId: string) => {
    setChatModelIdToDelete(chatModelId);
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
      {chatModelIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setChatModelIdToDelete(null)}
          title={t('confirmChatModelDeleteTitle')}
          message={t('deleteChatModelConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteChatModelTrigger(chatModelIdToDelete);
            setChatModelIdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('chatModelList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_CHATMODEL)}
        >
          {t('createChatModel')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
    </Stack>
  );
};

export default ChatModelManagementPage;
