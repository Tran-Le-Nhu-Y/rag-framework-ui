import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import {
  AppSnackbar,
  ConfirmDialog,
  DataGridTable,
  Loading,
} from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import type { Tool } from '../../@types/entities';
import SearchToolCreateDialog from './SearchToolCreationDialog';
import SearchToolUpdateDialog from './SearchToolUpdateDialog';
import {
  useCreateTool,
  useDeleteTool,
  useGetTools,
  useUpdateTool,
} from '../../service';
import { HideDuration, SnackbarSeverity } from '../../util';

const SearchToolManagementPage = () => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openToolCreationDialog, setOpenToolCreationDialog] = useState(false);
  const [openToolUpdateDialog, setOpenToolUpdateDialog] = useState(false);
  const [toolToUpdate, setToolToUpdate] = useState<Tool | null>(null);
  const [toolIdToDelete, setToolIdToDelete] = useState<string | null>(null);

  const columns: GridColDef<Tool>[] = [
    {
      field: 'name',
      headerName: t('searchToolName'),
      type: 'string',
      width: 300,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'type',
      headerName: t('searchingType'),
      type: 'string',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'max_results',
      headerName: t('maxResults'),
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
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => {
            setToolToUpdate(params.row);
            setOpenToolUpdateDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={() => handleDeleteTool(params.row.id)}
        />,
      ],
    },
  ];

  // Fetch all tools
  const [toolsQuery] = useState<GetToolQuery>({
    offset: 0,
    limit: 40,
  });
  const tools = useGetTools(toolsQuery!, {
    skip: !toolsQuery,
  });
  useEffect(() => {
    if (tools.isError) {
      setSnackbarMessage(t('toolsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [tools.isError, t]);

  const rows = useMemo(() => {
    if (tools.isError) return [];
    if (!tools.data?.content) return [];
    return tools.data.content.map(
      (tool) =>
        ({
          id: tool.id,
          name: tool.name,
          type: tool.type,
          max_results: tool.max_results,
        } as Tool)
    );
  }, [tools.data?.content, tools.isError]);

  //delete tool
  const [deleteToolTrigger, deleteTool] = useDeleteTool();
  useEffect(() => {
    if (deleteTool.isError) {
      setSnackbarMessage(t('deleteToolFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (deleteTool.isSuccess) {
      setSnackbarMessage(t('deleteToolSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [deleteTool.isError, deleteTool.isSuccess, t]);

  const handleDeleteTool = (toolId: string) => {
    setToolIdToDelete(toolId);
  };

  //create tool
  const [createToolTrigger, createTool] = useCreateTool();

  const handleCreateToolSubmit = async (createTool: Tool) => {
    try {
      const newTool: CreateToolRequest = {
        name: createTool.name,
        type: createTool.type,
        max_results: createTool.max_results,
      };

      await createToolTrigger(newTool);
      setOpenToolCreationDialog(false);

      setSnackbarMessage(t('createToolSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Creating tool  have error:', error);
      setSnackbarMessage(t('createToolFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }
  };

  //update tool
  const [updateToolTrigger] = useUpdateTool();

  const handleUpdateToolSubmit = async (updateTool: Tool) => {
    if (!updateTool.name.trim()) {
      setSnackbarMessage(t('toolNameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    try {
      await updateToolTrigger({
        id: updateTool.id,
        name: updateTool.name,
        type: updateTool.type,
        max_results: updateTool.max_results,
      });

      setSnackbarMessage(t('updateToolSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setOpenToolUpdateDialog(false);
    } catch (error) {
      setSnackbarMessage(t('updateToolFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      console.error(error);
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
      <SearchToolCreateDialog
        open={openToolCreationDialog}
        onExit={() => setOpenToolCreationDialog(false)}
        onCreate={(tool) => handleCreateToolSubmit(tool)}
      />

      <SearchToolUpdateDialog
        open={openToolUpdateDialog}
        tool={toolToUpdate}
        onExit={() => {
          setToolToUpdate(null);
          setOpenToolUpdateDialog(false);
        }}
        onUpdate={(tool) => handleUpdateToolSubmit(tool)}
      />
      {toolIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setToolIdToDelete(null)}
          title={t('confirmToolDeleteTitle')}
          message={t('deleteToolConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteToolTrigger(toolIdToDelete);
            setToolIdToDelete(null);
          }}
        />
      )}
      <Typography variant="h4">{t('searchTools')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => setOpenToolCreationDialog(true)}
        >
          {t('createSearchTool')}
        </Button>
      </Box>
      {tools.isLoading ||
      tools.isFetching ||
      deleteTool.isLoading ||
      createTool.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )}
    </Stack>
  );
};

export default SearchToolManagementPage;
