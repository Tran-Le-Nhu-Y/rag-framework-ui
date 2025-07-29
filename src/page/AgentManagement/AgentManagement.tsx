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
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import { useEffect, useMemo, useState } from 'react';
import AgentDetailDialog from './AgentDetailDialog';
import {
  useDeleteAgent,
  useGetAgents,
  useGetAgentTokenById,
} from '../../service';
import type { Agent } from '../../@types/entities';
import { downloadFile } from '../../service/api';

const AgentManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewedAgent, setViewedAgent] = useState<Agent | null>(null);
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
  // Fetch all agents
  const [agentQuery] = useState<GetAgentQuery>({
    offset: 0,
    limit: 40,
  });
  const agents = useGetAgents(agentQuery!, {
    skip: !agentQuery,
  });
  useEffect(() => {
    if (agents.isError) {
      setSnackbarMessage(t('agentsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [agents.isError, t]);

  const rows = useMemo(() => {
    if (agents.isError) return [];
    if (agents.data?.content)
      return agents.data.content.map(
        (agent) =>
          ({
            ...agent,
            id: agent.id,
          } as Agent)
      );
    else return [];
  }, [agents.data?.content, agents.isError]);
  const columns: GridColDef<Agent>[] = [
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
          onClick={() => handleExport(params.row.id)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon color="primary" />
            </Tooltip>
          }
          label={t('see')}
          onClick={() => {
            setViewedAgent(params.row);
            setDetailOpen(true);
          }}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon color="primary" />
            </Tooltip>
          }
          label={t('update')}
          onClick={() =>
            navigate(
              RoutePaths.UPDATE_AGENT.replace(
                `:${PathHolders.AGENT_ID}`,
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
          onClick={() => setAgentIdToDelete(params.row.id)}
        />,
      ],
    },
  ];

  //delete agent
  const [deleteAgentTrigger, deleteAgent] = useDeleteAgent();
  const handleDeleteAgent = async (id: string) => {
    try {
      await deleteAgentTrigger(id);
      setAgentIdToDelete(null);
      setSnackbarMessage(t('deleteAgentSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('deleteAgentFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };

  //export Agent File Config
  const [getTokenById] = useGetAgentTokenById();
  const handleExport = async (agentId: string) => {
    if (!agentId) return;

    try {
      const token = await getTokenById(agentId).unwrap();

      const link = document.createElement('a');
      link.href = downloadFile(token);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(t('exportFileError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" spacing={2}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      {agentIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setAgentIdToDelete(null)}
          title={t('confirmAgentDeleteTitle')}
          message={t('deleteAgentConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={() => handleDeleteAgent(agentIdToDelete)}
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
      {agents.isLoading || agents.isFetching || deleteAgent.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}
      {viewedAgent && (
        <AgentDetailDialog
          agent={viewedAgent}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </Stack>
  );
};

export default AgentManagementPage;
