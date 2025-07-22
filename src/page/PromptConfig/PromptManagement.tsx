import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import PromptUpdateDialog from './PromptUpdate';
import PromptDetailDialog from './PromptDetail';

const PromptManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openUpdatePromptDialog, setOpenUpdatePromptDialog] = useState(false);
  const [openPromptDetailDialog, setOpenPromptDetailDialog] = useState(false);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'promptName',
      headerName: t('promptName'),
      width: 250,
      editable: true,
    },
    {
      field: 'promptDescription',
      headerName: t('promptDescription'),
      width: 250,
      editable: true,
    },
    {
      field: 'createdAt',
      headerName: t('createAt'),
      type: 'string',
      width: 150,
      editable: true,
    },

    {
      field: 'updatedAt',
      headerName: t('updateAt'),
      type: 'string',
      width: 150,
      editable: true,
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
          onClick={() => setOpenUpdatePromptDialog(true)}
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

  const rows = [
    {
      id: 1,
      promptName: 'A',
      promptDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 2,
      promptName: 'B',
      promptDescription: 'B',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 3,
      promptName: 'C',
      promptDescription: 'C',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 4,
      promptName: 'D',
      promptDescription: 'D',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 5,
      promptName: 'E',
      promptDescription: 'E',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 6,
      promptName: 'F',
      promptDescription: 'F',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 7,
      promptName: 'G',
      promptDescription: 'G',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
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
      <Typography variant="h4">{t('promptList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/prompt-creation')}
        >
          {t('createPrompt')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>

      <PromptUpdateDialog
        open={openUpdatePromptDialog}
        onCancel={() => setOpenUpdatePromptDialog(false)}
        onConfirm={() => {}}
        // onFilesChange={() => {
        //   console.log('Handle file uploads');
        // }}
      />
      <PromptDetailDialog
        open={openPromptDetailDialog}
        onExit={() => setOpenPromptDetailDialog(false)}
        onExport={() => {}}
      />
    </Stack>
  );
};

export default PromptManagementPage;
