import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { ConfirmDialog, DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { Tool } from '../../@types/entities';
import SearchToolCreateDialog from './SearchToolCreationDialog';
import SearchToolUpdateDialog from './SearchToolUpdateDialog';

const SearchToolManagementPage = () => {
  const { t } = useTranslation();
  //   const [snackbarOpen, setSnackbarOpen] = useState(false);
  //   const [snackbarMessage, setSnackbarMessage] = useState('');
  //   const [snackbarSeverity, setSnackbarSeverity] =
  //     useState<SnackbarSeverity>('success');
  const [openToolCreationDialog, setOpenToolCreationDialog] = useState(false);
  const [openToolUpdateDialog, setOpenToolUpdateDialog] = useState(false);
  const [toolToUpdate, setToolToUpdate] = useState<Tool | null>(null);
  const [toolIdToDelete, setToolIdToDelete] = useState<string | null>(null);
  //   const [viewedPrompt, setViewedPrompt] = useState<Tool | null>(null);

  const [rows, setRows] = useState<Tool[]>([]);

  useEffect(() => {
    // Giả lập dữ liệu ban đầu
    const fakeData: Tool[] = [
      {
        id: '1',
        name: 'Web Search',
        type: 'DuckDuckGo',
        max_results: 10,
      },
      {
        id: '2',
        name: 'Document Lookup',
        type: 'InternalDB',
        max_results: 5,
      },
      {
        id: '3',
        name: 'Product Finder',
        type: 'ElasticSearch',
        max_results: 8,
      },
    ];
    setRows(fakeData);
  }, []);
  //   // Fetch all prompts
  //   const [promptsQuery] = useState<GetPromptsQuery>({
  //     offset: 0,
  //     limit: 40,
  //   });
  //   const prompts = useGetPrompts(promptsQuery!, {
  //     skip: !promptsQuery,
  //   });
  //   useEffect(() => {
  //     if (prompts.isError) {
  //       setSnackbarMessage(t('promptsLoadingError'));
  //       setSnackbarSeverity(SnackbarSeverity.ERROR);
  //       setSnackbarOpen(true);
  //     }
  //   }, [prompts.isError, t]);

  //   const [rows, setRows] = useState<Prompt[]>([]);
  //   useEffect(() => {
  //     if (prompts.data?.content) {
  //       const mappedRows: Prompt[] = prompts.data.content.map((prompt) => ({
  //         id: prompt.id,
  //         name: prompt.name,
  //         respond_prompt: prompt.respond_prompt,
  //       }));
  //       setRows(mappedRows);
  //     }
  //   }, [prompts.data, t]);

  const columns: GridColDef<Tool>[] = [
    {
      field: 'name',
      headerName: t('searchToolName'),
      type: 'string',
      width: 250,
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
        // <GridActionsCellItem
        //   icon={
        //     <Tooltip title={t('see')}>
        //       <RemoveRedEyeIcon />
        //     </Tooltip>
        //   }
        //   color="primary"
        //   label={t('see')}
        //   onClick={
        //     () => {

        // 	}
        //     //     setViewedPrompt({
        //     //       id: params.row.id,
        //     //       name: params.row.name,
        //     //       respond_prompt: params.row.respond_prompt,
        //     //     });
        //     //     setOpenToolCreationDialog(true);
        //     //   }
        //   }
        // />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={
            () => {
              setToolToUpdate(params.row);
              setOpenToolUpdateDialog(true);
            }
            // navigate(
            //   RoutePaths.UPDATE_PROMPT.replace(
            //     `:${PathHolders.PROMPT_ID}`,
            //     params.row.id
            //   )
            // )
          }
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={
            () => {
              setToolIdToDelete(params.row.id);
            }
            // handleDeletePrompt(params.row.id)
          }
        />,
      ],
    },
  ];
  //   const handleCreateTool = (newTool: Tool) => {
  //     // setSnackbarMessage(t('createPromptSuccess'));
  //     // setSnackbarSeverity('success');
  //     // setSnackbarOpen(true);
  //   };

  const handleUpdateTool = (updatedTool: Tool) => {
    setRows((prev) =>
      prev.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool))
    );
    // setSnackbarMessage(t('updatePromptSuccess'));
    // setSnackbarSeverity('success');
    // setSnackbarOpen(true);
  };
  //   //delete prompt
  //   const [deletePromptTrigger, deletePrompt] = useDeletePrompt();
  //   useEffect(() => {
  //     if (deletePrompt.isError) {
  //       setSnackbarMessage(t('deletePromptFailed'));
  //       setSnackbarSeverity(SnackbarSeverity.ERROR);
  //       setSnackbarOpen(true);
  //     }
  //     if (deletePrompt.isSuccess) {
  //       setSnackbarMessage(t('deletePromptSuccess'));
  //       setSnackbarSeverity(SnackbarSeverity.SUCCESS);
  //       setSnackbarOpen(true);
  //     }
  //   }, [deletePrompt.isError, deletePrompt.isSuccess, t]);

  //   const handleDeletePrompt = (promptId: string) => {
  //     setPromptIdToDelete(promptId);
  //   };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      {/* <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      /> */}
      <SearchToolCreateDialog
        open={openToolCreationDialog}
        onExit={() => setOpenToolCreationDialog(false)}
        onCreate={() => {}}
      />

      <SearchToolUpdateDialog
        open={openToolUpdateDialog}
        tool={toolToUpdate}
        onExit={() => {
          setToolToUpdate(null);
          setOpenToolUpdateDialog(false);
        }}
        onUpdate={handleUpdateTool}
      />
      {toolIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setToolIdToDelete(null)}
          title={t('confirmPromptDeleteTitle')}
          message={t('deletePromptConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={
            () => {}
            // 	async () => {
            //     await deletePromptTrigger(promptIdToDelete);
            //     setPromptIdToDelete(null);
            //   }
          }
        />
      )}
      <Typography variant="h4">{t('searchTools')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={
            () => {
              setOpenToolCreationDialog(true);
            }
            // navigate(RoutePaths.CREATE_PROMPT)
          }
        >
          {t('createSearchTool')}
        </Button>
      </Box>
      {/* {prompts.isLoading || prompts.isFetching || deletePrompt.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable rows={rows} columns={columns} />
        </Box>
      )} */}

      <Box sx={{ height: 500, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
    </Stack>
  );
};

export default SearchToolManagementPage;
