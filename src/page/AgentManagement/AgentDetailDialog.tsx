import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SaveAlt } from '@mui/icons-material';
import type { Agent } from '../../@types/entities';
import { useEffect, useState } from 'react';
import { AppSnackbar } from '../../component';
import { SnackbarSeverity, HideDuration } from '../../util';

import {
  useGetVectorStores,
  useGetBM25s,
  useGetMCPs,
  useGetTools,
  useGetChatModelById,
  useGetPromptById,
  useGetRecognizerById,
  useGetAgentTokenById,
} from '../../service';
import { downloadFile } from '../../service/api';

function filterByIds<T extends { id: string }>(
  items: T[] = [],
  ids: string[] = []
) {
  return items.filter((item) => ids.includes(item.id));
}

export default function AgentDetailDialog({
  open,
  agent,
  onClose,
}: {
  open: boolean;
  agent: Agent;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  //get chat model
  const chatModelDetail = useGetChatModelById(agent.llm_id);
  useEffect(() => {
    if (chatModelDetail.isError) {
      setSnackbarMessage(t('chatModelLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [chatModelDetail.isError, t]);

  // get prompt
  const prompt = useGetPromptById(agent.prompt_id);
  useEffect(() => {
    if (prompt.isError) {
      setSnackbarMessage(t('promptLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [prompt.isError, t]);

  // get cnn model
  const recognizerDetail = useGetRecognizerById(agent.image_recognizer_id!, {
    skip: !agent.image_recognizer_id,
  });
  useEffect(() => {
    if (recognizerDetail.isError) {
      setSnackbarMessage(t('cnnLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [recognizerDetail.data, recognizerDetail.isError, t]);

  // get all vector store
  const [vectorStoreQuery] = useState<GetVectorStoreQuery>({
    offset: 0,
    limit: 40,
  });
  const vectorStores = useGetVectorStores(vectorStoreQuery!, {
    skip: !vectorStoreQuery,
  });
  useEffect(() => {
    if (vectorStores.isError) {
      setSnackbarMessage(t('vectorStoresLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [t, vectorStores.isError]);
  //get all bm25
  const [bm25Query] = useState<GetBM25Query>({
    offset: 0,
    limit: 40,
  });
  const bm25s = useGetBM25s(bm25Query!, {
    skip: !bm25Query,
  });
  useEffect(() => {
    if (bm25s.isError) {
      setSnackbarMessage(t('bm25sLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [bm25s.isError, t]);

  // GET all MCP
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
  }, [mcps.data?.content, mcps.isError, t]);

  // get all tools
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
  }, [tools.isError, t, tools.data?.content]);

  //Filter vector store name
  const selectedVectorStores = filterByIds(
    vectorStores.data?.content,
    agent.retriever_ids || []
  );
  const storeNames = selectedVectorStores.map((t) => t.name).join(', ');

  //Filter bm25 name
  const selectedBM25s = filterByIds(
    bm25s.data?.content,
    agent.retriever_ids || []
  );
  const bm25Names = selectedBM25s.map((t) => t.name).join(', ');

  //Filter mcp name
  const selectedMCPs = filterByIds(
    mcps.data?.content,
    agent.mcp_server_ids || []
  );
  const mcpNames = selectedMCPs.map((t) => t.name).join(', ');

  //Filter tool name
  const selectedTools = filterByIds(tools.data?.content, agent.tool_ids || []);
  const toolNames = selectedTools.map((t) => t.name).join(', ');

  //export Agent File Config
  const [getTokenById] = useGetAgentTokenById();
  const handleExport = async () => {
    if (!agent.id) return;

    try {
      const token = await getTokenById(agent.id).unwrap();

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle variant="h4" sx={{ textAlign: 'center' }}>
        {t('agentDetailInformation')}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <AppSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            autoHideDuration={HideDuration.FAST}
            onClose={() => setSnackbarOpen(false)}
          />
          <Box display={'flex'} justifyContent={'space-between'}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight="bold">{t('agentName')}:</Typography>
              <Typography>{agent?.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight="bold">{t('language')}:</Typography>
              <Typography>
                {agent?.language == 'en' ? t('en') : t('vi')}
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={1}>
            <Typography fontWeight="bold">{t('agentDescription')}:</Typography>
            <Box sx={{ textAlign: 'justify' }}>
              <Typography>{agent?.description || 'N/A'}</Typography>
            </Box>
          </Stack>

          <Divider />
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('promptConfig')}:</Typography>
            <Typography>{prompt.data?.name || 'N/A'}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('chatModelConfig')}:</Typography>
            <Typography>{chatModelDetail.data?.model_name || 'N/A'}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('cnnModelConfig')}:</Typography>
            <Typography>{recognizerDetail.data?.name || 'N/A'}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight="bold">
              {t('retrieverModelConfig')}:
            </Typography>
            <Stack pl={5} spacing={2}>
              <Stack direction="row" spacing={1}>
                <Typography fontWeight="bold">
                  {t('vectorStoreConfig')}:
                </Typography>
                <Typography>{storeNames || 'N/A'}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography fontWeight="bold">
                  {t('bm25ModelConfig')}:
                </Typography>
                <Typography>{bm25Names || 'N/A'}</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('mcpModelConfig')}:</Typography>
            <Typography>{mcpNames || 'N/A'}</Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('promptConfig')}:</Typography>
            <Typography>{toolNames || 'N/A'}</Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleExport}
          startIcon={<SaveAlt />}
          variant="contained"
        >
          {t('export')}
        </Button>
        <Button onClick={onClose} variant="outlined">
          {t('exit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
