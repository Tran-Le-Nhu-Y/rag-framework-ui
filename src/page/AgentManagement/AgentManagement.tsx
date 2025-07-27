import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { ConfirmDialog, DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { RoutePaths } from '../../util';
import { useState } from 'react';
import AgentDetailDialog from './AgentDetailDialog';

const fakeAgents = [
  {
    id: '1',
    name: 'ShrimpAgent Alpha',
    description: 'An agent for detecting white spot disease.',
    language: 'en',
    image_recognizer_id: 'White Spot Detector v1.0',
    retriever_ids: ['BM25 Retriever'],
    tool_ids: ['tool_1', 'tool_2'],
    mcp_server_ids: ['mcp_1'],
    llm_id: 'llm_1',
    prompt_id: 'prompt_1',
    createdAt: '2024-05-01',
    updatedAt: '2024-06-01',
  },
  {
    id: '2',
    name: 'Tôm AI Pro',
    description: 'Hỗ trợ chẩn đoán bệnh cho tôm.',
    language: 'vi',
    image_recognizer_id: 'model_2',
    retriever_ids: ['retriever_2'],
    tool_ids: null,
    mcp_server_ids: ['mcp_2', 'mcp_3'],
    llm_id: 'llm_2',
    prompt_id: 'prompt_2',
    createdAt: '2024-05-02',
    updatedAt: '2024-06-02',
  },
];

const AgentManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agentIdToDelete, setAgentIdToDelete] = useState<string | null>(null);
  //   const handleExport = (agent: any) => {
  //     const blob = new Blob([JSON.stringify(agent, null, 2)], {
  //       type: 'application/json',
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${agent.name}-config.json`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   };
  const [detailOpen, setDetailOpen] = useState(false);
  const columns: GridColDef<(typeof fakeAgents)[number]>[] = [
    {
      field: 'name',
      headerName: t('agentName'),
      width: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: t('agentDescription'),
      width: 250,
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <span>{params.value ?? '-'}</span>
        </Tooltip>
      ),
    },
    {
      field: 'language',
      headerName: t('language'),
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'image_recognizer_id',
      headerName: t('cnnModelConfig'),
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'retriever_ids',
      headerName: t('retrieverModelConfig'),
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => params.value?.join(', ') || '-',
    },

    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 180,
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
              <RemoveRedEyeIcon color="primary" />
            </Tooltip>
          }
          label={t('see')}
          onClick={() => setDetailOpen(true)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon color="primary" />
            </Tooltip>
          }
          label={t('update')}
          onClick={() => navigate(RoutePaths.UPDATE_AGENT)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={() => handleDeleteAgent(params.row.id)}
        />,
      ],
    },
  ];

  const handleDeleteAgent = (agentlId: string) => {
    setAgentIdToDelete(agentlId);
  };

  return (
    <Stack justifyContent="center" alignItems="center" spacing={2}>
      {agentIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setAgentIdToDelete(null)}
          title={t('confirmAgentDeleteTitle')}
          message={t('deleteAgentConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={() => {}}
        />
      )}
      <Typography variant="h4">{t('agentList')}</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_AGENT)}
        >
          {t('createAgent')}
        </Button>
      </Box>

      <Box sx={{ height: 500, width: '90%' }}>
        <DataGridTable rows={fakeAgents} columns={columns} />
      </Box>
      <AgentDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </Stack>
  );
};

export default AgentManagementPage;
