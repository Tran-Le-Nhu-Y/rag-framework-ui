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
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import { useEffect, useMemo, useState } from 'react';
import {
  useDeleteChatModel,
  useGetChatModelById,
  useGetChatModels,
} from '../../service';
import ChatModelDetailDialog from './ChatModelDetail';
import type { BaseChatModel, ChatModel } from '../../@types/entities';
import { DeleteError } from '../../util/errors';

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
  const [openChatModelDetailDialog, setOpenChatModelDetailDialog] =
    useState(false);
  const [selectedChatModelId, setSelectedChatModelId] = useState<string | null>(
    null
  );
  const [viewedChatModel, setViewedChatModel] = useState<ChatModel | null>(
    null
  );

  const chatModelDetail = useGetChatModelById(selectedChatModelId!, {
    skip: !selectedChatModelId,
  });
  useEffect(() => {
    if (chatModelDetail.data) {
      setViewedChatModel(chatModelDetail.data);
      setOpenChatModelDetailDialog(true);
    }
  }, [chatModelDetail.data]);

  const columns: GridColDef<BaseChatModel>[] = [
    {
      field: 'name',
      headerName: t('configName'),
      type: 'string',
      width: 230,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'model_name',
      headerName: t('modelName'),
      type: 'string',
      width: 230,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'temperature',
      headerName: t('temperature'),
      type: 'number',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'top_k',
      headerName: t('topK'),
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'top_p',
      headerName: t('topP'),
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'type',
      headerName: t('modelType'),
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
            setSelectedChatModelId(params.row.id);
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
              RoutePaths.UPDATE_CHATMODEL.replace(
                `:${PathHolders.CHAT_MODEL_ID}`,
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
          onClick={() => setChatModelIdToDelete(params.row.id)}
        />,
      ],
    },
  ];
  const [chatModelQuery] = useState<GetChatModelsQuery>({
    offset: 0,
    limit: 40,
  });
  const chatModels = useGetChatModels(chatModelQuery!, {
    skip: !chatModelQuery,
  });
  useEffect(() => {
    if (chatModels.isError) {
      setSnackbarMessage(t('chatModelsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [chatModels.data?.content, chatModels.isError, t]);
  const rows = useMemo(() => {
    if (chatModels.isError) return [];
    if (chatModels.data?.content)
      return chatModels.data.content.map(
        (chatModel) =>
          ({
            ...chatModel,
            id: chatModel.id,
          } as ChatModel)
      );
    else return [];
  }, [chatModels.data?.content, chatModels.isError]);

  //delete chat model
  const [deleteChatModelTrigger, deleteChatModel] = useDeleteChatModel();
  const handleDeleteChatModel = async (id: string) => {
    try {
      await deleteChatModelTrigger(id).unwrap();
      setChatModelIdToDelete(null);
      setSnackbarMessage(t('deleteChatModelSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      switch (error) {
        case DeleteError.BEING_USED: {
          setSnackbarMessage(t('cannotDeleteChatModel'));
          setSnackbarSeverity(SnackbarSeverity.ERROR);
          setSnackbarOpen(true);
          break;
        }
        case DeleteError.UNKNOWN_ERROR: {
          setSnackbarMessage(t('deleteChatModelFailed'));
          setSnackbarSeverity(SnackbarSeverity.ERROR);
          setSnackbarOpen(true);
          break;
        }
      }
    }
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
          onDelete={() => handleDeleteChatModel(chatModelIdToDelete)}
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

      {chatModels.isLoading ||
      chatModels.isFetching ||
      chatModels.isLoading ||
      deleteChatModel.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 400, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}
      <ChatModelDetailDialog
        open={openChatModelDetailDialog}
        onExit={() => {
          setOpenChatModelDetailDialog(false);
          setSelectedChatModelId(null);
          setViewedChatModel(null);
        }}
        chatModel={viewedChatModel}
      />
    </Stack>
  );
};

export default ChatModelManagementPage;
