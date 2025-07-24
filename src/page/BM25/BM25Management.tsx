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
import { useEffect, useState } from 'react';
import { useDeleteMCP, useGetMCPs } from '../../service';
import {
  HideDuration,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
} from '../../util';
import type { MCPStreamableServer } from '../../@types/entities';
import BM25DetailDialog from './BM25Detail';

const BM25ManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openMCPDetailDialog, setOpenMCPDetailDialog] = useState(false);
  const [mcpIdToDelete, setMCPIdToDelete] = useState<string | null>(null);
  const [viewedMCP, setViewedMCP] = useState<MCPStreamableServer | null>(null);

  // Fetch all prompts
  const [mcpQuery] = useState<GetMCPQuery>({
    offset: 0,
    limit: 40,
  });
  const mcps = useGetMCPs(mcpQuery!, {
    skip: !mcpQuery,
  });
  useEffect(() => {
    if (mcps.isError) {
      setSnackbarMessage(t('mcpsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [mcps.isError, t]);

  const [rows, setRows] = useState<MCPStreamableServer[]>([]);
  useEffect(() => {
    if (mcps.data?.content) {
      const mappedRows: MCPStreamableServer[] = mcps.data.content.map(
        (mcp) => ({
          ...mcp,
          id: mcp.id,
        })
      );
      setRows(mappedRows);
    }
  }, [mcps.data, t]);

  const columns: GridColDef<MCPStreamableServer>[] = [
    {
      field: 'name',
      headerName: t('mcpName'),
      type: 'string',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'url',
      headerName: t('url'),
      type: 'string',
      width: 300,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'type',
      headerName: t('mcpType'),
      type: 'string',
      width: 200,
      headerAlign: 'center',
      align: 'center',
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
            setViewedMCP(params.row);
            setOpenMCPDetailDialog(true);
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
              RoutePaths.UPDATE_MCP.replace(
                `:${PathHolders.MCP_ID}`,
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
          onClick={() => handleDeleteMCP(params.row.id)}
        />,
      ],
    },
  ];

  //delete mcp
  const [deleteMCPTrigger, deleteMCP] = useDeleteMCP();
  useEffect(() => {
    if (deleteMCP.isError) {
      setSnackbarMessage(t('deleteMCPFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteMCP.isSuccess) {
      setSnackbarMessage(t('deleteMCPSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteMCP.isError, deleteMCP.isSuccess, t]);

  const handleDeleteMCP = (mcpId: string) => {
    setMCPIdToDelete(mcpId);
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
      {mcpIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setMCPIdToDelete(null)}
          title={t('confirmMCPDeleteTitle')}
          message={t('deleteMCPConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteMCPTrigger(mcpIdToDelete);
            setMCPIdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('mcpList')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(RoutePaths.CREATE_MCP)}
        >
          {t('createMCP')}
        </Button>
      </Box>
      {mcps.isLoading || mcps.isFetching || deleteMCP.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}

      <BM25DetailDialog
        open={openMCPDetailDialog}
        onExit={() => setOpenMCPDetailDialog(false)}
        mcp={viewedMCP}
      />
    </Stack>
  );
};

export default BM25ManagementPage;
