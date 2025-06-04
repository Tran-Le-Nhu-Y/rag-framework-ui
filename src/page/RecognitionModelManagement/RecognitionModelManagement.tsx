import { Box, Button, Stack, Tooltip } from '@mui/material';
import { DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import RecognitionModelDetailDialog from './RecognitionModelDetail';
import RecognitionModelUpdateDialog from './RecognitionModelUpdate';
import { useNavigate } from 'react-router';

const RecognitionModelManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openUpdateAgentDialog, setOpenUpdateAgentDialog] = useState(false);
  const [openAgentDetailDialog, setOpenAgentDetailDialog] = useState(false);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'recognitionModelName',
      headerName: t('recognitionModelName'),
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
          onClick={() => setOpenAgentDetailDialog(true)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => setOpenUpdateAgentDialog(true)}
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
      recognitionModelName: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 2,
      recognitionModelName: 'B',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 3,
      recognitionModelName: 'C',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 4,
      recognitionModelName: 'D',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 5,
      recognitionModelName: 'E',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 6,
      recognitionModelName: 'F',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 7,
      recognitionModelName: 'G',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
  ];

  const handleUpdateAgent = (data: { name: string; description: string }) => {
    console.log('Updated agent:', data);
    setOpenUpdateAgentDialog(false);
    // TODO: Gọi API lưu hoặc cập nhật danh sách agent
  };
  const handleExport = () => {
    const content = {
      name: 'agentName',
      description: 'agentDescription',
    };
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${'agent'}-config.json`; // Đặt tên file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <h1>{t('recognitionModelList')}</h1>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/recognition-model-creation')}
        >
          {t('createRecognitionModel')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>

      <RecognitionModelUpdateDialog
        open={openUpdateAgentDialog}
        onCancel={() => setOpenUpdateAgentDialog(false)}
        onConfirm={handleUpdateAgent}
        onFilesChange={() => {
          console.log('Handle file uploads');
        }}
      />
      <RecognitionModelDetailDialog
        open={openAgentDetailDialog}
        onExit={() => setOpenAgentDetailDialog(false)}
        onExport={handleExport}
      />
    </Stack>
  );
};

export default RecognitionModelManagementPage;
