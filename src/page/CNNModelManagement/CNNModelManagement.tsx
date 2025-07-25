import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import CNNModelDetailDialog from './CNNModelDetail';
import { PathHolders, RoutePaths } from '../../util';

const CNNModelManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openAgentDetailDialog, setOpenAgentDetailDialog] = useState(false);

  const columns: GridColDef[] = [
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
          onClick={() => console.log('Delete', params.row.id)}
        />,
      ],
    },
  ];

  const rows = [
    {
      id: '1',
      name: 'Fish Classifier',
      min_probability: 0.7,
      max_results: 3,
      output_classes: [
        { name: 'Tilapia', description: 'Freshwater fish' },
        { name: 'Salmon', description: 'Sea fish' },
      ],
    },
    {
      id: '2',
      name: 'Shrimp Detector',
      min_probability: 0.5,
      max_results: 5,
      output_classes: [
        { name: 'White spot', description: 'Common disease' },
        { name: 'Healthy', description: 'No disease' },
      ],
    },
    {
      id: '3',
      name: 'Crab Recognizer',
      min_probability: 0.6,
      max_results: 2,
      output_classes: [
        { name: 'Red Crab', description: 'Type A' },
        { name: 'Blue Crab', description: 'Type B' },
      ],
    },
  ];

  //   const handleExport = (row: any) => {
  //     const blob = new Blob([JSON.stringify(row, null, 2)], {
  //       type: 'application/json',
  //     });

  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${row.name}-config.json`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   };

  return (
    <Stack justifyContent="center" alignItems="center" spacing={2}>
      <Typography variant="h4">{t('recognitionModelList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_CNN)}
        >
          {t('createRecognitionModel')}
        </Button>
      </Box>
      <Box sx={{ height: 500, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>

      <CNNModelDetailDialog
        open={openAgentDetailDialog}
        onExit={() => setOpenAgentDetailDialog(false)}
        onExport={() => {}}
      />
    </Stack>
  );
};

export default CNNModelManagementPage;
