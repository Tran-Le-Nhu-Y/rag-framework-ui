import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { ConfirmDialog, DataGridTable, Loading } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import PromptDetailDialog from './PromptDetail';
import { useDeletePrompt, useGetPrompts } from '../../service';
import { PathHolders, RoutePaths, SnackbarSeverity } from '../../util';
import { useSnackbar } from '../../hook';

const PromptManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const [openPromptDetailDialog, setOpenPromptDetailDialog] = useState(false);
  const [promptIdToDelete, setPromptIdToDelete] = useState<string | null>(null);
  const [viewedPrompt, setViewedPrompt] = useState<Prompt | null>(null);

  // Fetch all prompts
  const [promptsQuery] = useState<GetPromptsQuery>({
    offset: 0,
    limit: 40,
  });
  const prompts = useGetPrompts(promptsQuery);
  useEffect(() => {
    if (prompts.isError) {
      showSnackbar({
        message: t('promptsLoadingError'),
        severity: SnackbarSeverity.ERROR,
      });
    }
  }, [prompts.isError, showSnackbar, t]);

  const [rows, setRows] = useState<Prompt[]>([]);
  useEffect(() => {
    if (prompts.data?.content) {
      const mappedRows: Prompt[] = prompts.data.content.map((prompt) => ({
        id: prompt.id,
        suggest_questions_prompt: prompt.suggest_questions_prompt,
        respond_prompt: prompt.respond_prompt,
      }));
      setRows(mappedRows);
    }
  }, [prompts.data, t]);

  const columns: GridColDef<Prompt>[] = [
    {
      field: 'suggest_questions_prompt',
      headerName: t('suggest_questions_prompt'),
      type: 'string',
      width: 350,
      editable: true,
      headerAlign: 'center',
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
              suggest_questions_prompt: params.row.suggest_questions_prompt,
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
      showSnackbar({
        message: t('deletePromptSuccess'),
        severity: SnackbarSeverity.SUCCESS,
      });
    } catch (error) {
      console.warn(error);
      showSnackbar({
        message: t('deletePromptFailed'),
        severity: SnackbarSeverity.ERROR,
      });
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      {promptIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setPromptIdToDelete(null)}
          title={t('confirmPromptDeleteTitle')}
          message={t('deletePromptConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await handleDeletePrompt(promptIdToDelete);
            setPromptIdToDelete(null);
          }}
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
