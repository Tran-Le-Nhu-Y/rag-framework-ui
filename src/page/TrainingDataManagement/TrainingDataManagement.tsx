import { Box, Button, Stack, Tooltip } from '@mui/material';
import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { DataGridTable } from '../../component';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import TrainingDataCreationDialog from './TrainingDataCreation';
import TrainingDataUpdateDialog from './TrainingDataUpdate';
import TrainingDataDetailDialog from './TrainingDataDetail';
import { useState } from 'react';

const TrainingDataManagementPage = () => {
  const { t } = useTranslation();
  const [openCreateTrainingDataDialog, setOpenCreateTrainingDataDialog] =
    useState(false);
  const [openUpdateTrainingDataDialog, setOpenUpdateTrainingDataDialog] =
    useState(false);
  const [openTrainingDataDetailDialog, setOpenTrainingDataDetailDialog] =
    useState(false);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'trainingDataName',
      headerName: t('trainingDataName'),
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
          onClick={() => setOpenTrainingDataDetailDialog(true)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => setOpenUpdateTrainingDataDialog(true)}
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
      trainingDataName: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 2,
      trainingDataName: 'B',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 3,
      trainingDataName: 'C',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 4,
      trainingDataName: 'D',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 5,
      trainingDataName: 'E',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 6,
      trainingDataName: 'F',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
    {
      id: 7,
      trainingDataName: 'G',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
    },
  ];

  const handleCreateTrainingData = (data: {
    name: string;
    description: string;
  }) => {
    console.log('Created TrainingData:', data);
    setOpenCreateTrainingDataDialog(false);
    // TODO: Gọi API lưu hoặc cập nhật danh sách agent
  };
  const handleUpdateTrainingData = (data: {
    name: string;
    description: string;
  }) => {
    console.log('Updated TrainingData:', data);
    setOpenUpdateTrainingDataDialog(false);
    // TODO: Gọi API lưu hoặc cập nhật danh sách agent
  };
  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <h1>{t('trainingDataList')}</h1>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => setOpenCreateTrainingDataDialog(true)}
        >
          {t('createTrainingData')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
      <TrainingDataCreationDialog
        open={openCreateTrainingDataDialog}
        onCancel={() => setOpenCreateTrainingDataDialog(false)}
        onConfirm={handleCreateTrainingData}
        onFilesChange={() => {
          console.log('Handle file uploads');
        }}
      />
      <TrainingDataUpdateDialog
        open={openUpdateTrainingDataDialog}
        onCancel={() => setOpenUpdateTrainingDataDialog(false)}
        onConfirm={handleUpdateTrainingData}
        onFilesChange={() => {
          console.log('Handle file uploads');
        }}
      />
      <TrainingDataDetailDialog
        open={openTrainingDataDetailDialog}
        onExit={() => setOpenTrainingDataDetailDialog(false)}
      />
    </Stack>
  );
};

export default TrainingDataManagementPage;
