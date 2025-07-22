import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { ConfirmDialog, DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PathHolders, RoutePaths, SnackbarSeverity } from '../../util';
import { useEffect, useState } from 'react';
import {
  useDeleteChatModel,
  useGetChatModelById,
  useGetChatModels,
} from '../../service';
import ChatModelDetailDialog from './ChatModelDetail';
import { useSnackbar } from '../../hook';

const ChatModelManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show: showSnackbar } = useSnackbar();
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
      field: 'modelName',
      headerName: t('modelName'),
      type: 'string',
      width: 250,
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
              RoutePaths.UPDATE_CHAT_MODEL.replace(
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
  const chatModel = useGetChatModels(chatModelQuery);
  useEffect(() => {
    if (chatModel.isError) {
      showSnackbar({
        message: t('chatModelLoadingError'),
        severity: SnackbarSeverity.ERROR,
      });
    }
  }, [chatModel.isError, showSnackbar, t]);

  //delete chat model
  const [deleteChatModelTrigger] = useDeleteChatModel();
  const handleDeleteChatModel = async (chatModelId: string) => {
    try {
      await deleteChatModelTrigger(chatModelId).unwrap();
      setChatModelIdToDelete(null);
      showSnackbar({
        message: t('deleteChatModelSuccess'),
        severity: SnackbarSeverity.SUCCESS,
      });
    } catch (error) {
      console.warn(error);
      showSnackbar({
        message: t('deleteChatModelFailed'),
        severity: SnackbarSeverity.ERROR,
      });
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      {chatModelIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setChatModelIdToDelete(null)}
          title={t('confirmChatModelDeleteTitle')}
          message={t('deleteChatModelConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await handleDeleteChatModel(chatModelIdToDelete);
          }}
        />
      )}
      <Typography variant="h4">{t('chatModelList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_CHAT_MODEL)}
        >
          {t('createChatModel')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={chatModel.data?.content ?? []} columns={columns} />
      </Box>
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
