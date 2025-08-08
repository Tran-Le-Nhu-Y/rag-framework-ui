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
import PromptDetailDialog from './PromptDetail';
import { useDeletePrompt, useGetPrompts } from '../../service';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import type { Prompt } from '../../@types/entities';
import { DeleteError } from '../../util/errors';

const PromptManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openPromptDetailDialog, setOpenPromptDetailDialog] = useState(false);
  const [promptIdToDelete, setPromptIdToDelete] = useState<string | null>(null);
  const [viewedPrompt, setViewedPrompt] = useState<Prompt | null>(null);

  // Fetch all prompts
  const [promptsQuery] = useState<GetPromptsQuery>({
    offset: 0,
    limit: 40,
  });
  const prompts = useGetPrompts(promptsQuery!, {
    skip: !promptsQuery,
  });
  useEffect(() => {
    if (prompts.isError) {
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [prompts.isError, t]);

  const rows = useMemo(() => {
    if (prompts.isError) return [];
    if (prompts.data?.content)
      return prompts.data.content.map(
        (prompt) =>
          ({
            ...prompt,
            id: prompt.id,
          } as Prompt)
      );
    else return [];
  }, [prompts.data?.content, prompts.isError]);

  const columns: GridColDef<Prompt>[] = [
    {
      field: 'name',
      headerName: t('promptName'),
      type: 'string',
      width: 250,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'respond_prompt',
      headerName: t('respond_prompt'),
      type: 'string',
      width: 500,
      editable: true,
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
            setViewedPrompt({
              id: params.row.id,
              name: params.row.name,
              respond_prompt: params.row.respond_prompt,
            });
            setOpenPromptDetailDialog(true);
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
              RoutePaths.UPDATE_PROMPT.replace(
                `:${PathHolders.PROMPT_ID}`,
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
          onClick={() => setPromptIdToDelete(params.row.id)}
        />,
      ],
    },
  ];

  //delete prompt
  const [deletePromptTrigger, deletePrompt] = useDeletePrompt();
  const handleDeletePrompt = async (promptId: string) => {
    try {
      await deletePromptTrigger(promptId).unwrap();
      setPromptIdToDelete(null);
      setSnackbarMessage(t('deletePromptSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      switch (error) {
        case DeleteError.BEING_USED: {
          setSnackbarMessage(t('cannotDeletePrompt'));
          setSnackbarSeverity(SnackbarSeverity.ERROR);
          setSnackbarOpen(true);
          break;
        }
        case DeleteError.UNKNOWN_ERROR: {
          setSnackbarMessage(t('deletePromptFailed'));
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
      {promptIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setPromptIdToDelete(null)}
          title={t('confirmPromptDeleteTitle')}
          message={t('deletePromptConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={() => handleDeletePrompt(promptIdToDelete)}
        />
      )}
      <Typography variant="h4">{t('promptList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_PROMPT)}
        >
          {t('createPrompt')}
        </Button>
      </Box>
      {prompts.isLoading || prompts.isFetching || deletePrompt.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}

      <PromptDetailDialog
        open={openPromptDetailDialog}
        onExit={() => setOpenPromptDetailDialog(false)}
        prompt={viewedPrompt}
      />
    </Stack>
  );
};

export default PromptManagementPage;
