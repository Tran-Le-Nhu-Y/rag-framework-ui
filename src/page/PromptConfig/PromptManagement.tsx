import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import PromptDetailDialog from './PromptDetail';
import { useGetPrompts } from '../../service';
import { HideDuration, SnackbarSeverity } from '../../util';

const PromptManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openPromptDetailDialog, setOpenPromptDetailDialog] = useState(false);

  // Fetch all prompts
  const [promptsQuery] = useState<GetPromptsQuery>({
    offset: 0,
    limit: 40,
  });
  const prompts = useGetPrompts(promptsQuery!, {
    skip: !promptsQuery,
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    if (prompts.isError) {
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [prompts.isError, t]);

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
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'respond_prompt',
      headerName: t('respond_prompt'),
      type: 'string',
      width: 500,
      editable: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 250,
      getActions: () => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon />
            </Tooltip>
          }
          color="primary"
          label={t('see')}
          onClick={() => setOpenPromptDetailDialog(true)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => navigate('/prompt-update')}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={() => {}}
        />,
      ],
    },
  ];

  //   const handleUpdateAgent = (data: { name: string; description: string }) => {
  //     console.log('Updated agent:', data);
  //     setOpenUpdateAgentDialog(false);
  //     // TODO: Gọi API lưu hoặc cập nhật danh sách agent
  //   };
  //   const handleExport = () => {
  //     const content = {
  //       name: 'agentName',
  //       description: 'agentDescription',
  //     };
  //     const blob = new Blob([JSON.stringify(content, null, 2)], {
  //       type: 'application/json',
  //     });

  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${'agent'}-config.json`; // Đặt tên file
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography variant="h4">{t('promptList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/prompt-creation')}
        >
          {t('createPrompt')}
        </Button>
      </Box>
      <Box sx={{ height: 500, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>

      <PromptDetailDialog
        open={openPromptDetailDialog}
        onExit={() => setOpenPromptDetailDialog(false)}
        onExport={() => {}}
      />
    </Stack>
  );
};

export default PromptManagementPage;
