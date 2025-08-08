import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  HideDuration,
  isValidLength,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import type { Data } from '../../component/SelectForm';
import { useNavigate } from 'react-router';
import SelectForm from '../../component/SelectForm';
import type {
  Agent,
  BM25Retriever,
  ChatModel,
  ChromaRetriever,
  ImageRecognizer,
  MCPStreamableServer,
  Prompt,
  Tool,
} from '../../@types/entities';
import {
  useCreateAgent,
  useGetBM25s,
  useGetChatModels,
  useGetMCPs,
  useGetPrompts,
  useGetRecognizer,
  useGetTools,
  useGetVectorStores,
} from '../../service';
import { AppSnackbar, Loading } from '../../component';

const languageList: Data[] = [
  { label: 'Tiếng Anh', value: 'en' },
  { label: 'Tiếng Việt', value: 'vi' },
];

export default function AgentCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [agent, setAgent] = useState<Agent>({
    id: '',
    name: '',
    description: '',
    language: '',
    image_recognizer_id: null,
    llm_id: '',
    prompt_id: '',
    retriever_ids: null,
    mcp_server_ids: null,
    tool_ids: null,
  });

  //get all chat model
  const [chatModelList, setChatModelList] = useState<Data[]>([]);
  const [chatModelQuery] = useState<GetChatModelsQuery>({
    offset: 0,
    limit: 40,
  });
  const chatModels = useGetChatModels(chatModelQuery!, {
    skip: !chatModelQuery,
  });
  useEffect(() => {
    if (chatModels.data?.content) {
      const mappedList: Data[] = chatModels.data.content.map(
        (item: ChatModel) => ({
          label: item.model_name,
          value: item.id,
        })
      );
      setChatModelList(mappedList);
    }
    if (chatModels.isError) {
      setSnackbarMessage(t('chatModelsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [chatModels.data?.content, chatModels.isError, t]);

  // get all prompts
  const [promptList, setPromptList] = useState<Data[]>([]);
  const [promptsQuery] = useState<GetPromptsQuery>({
    offset: 0,
    limit: 40,
  });
  const prompts = useGetPrompts(promptsQuery!, {
    skip: !promptsQuery,
  });
  useEffect(() => {
    if (prompts.data?.content) {
      const mappedList: Data[] = prompts.data.content.map((item: Prompt) => ({
        label: item.name,
        value: item.id,
      }));
      setPromptList(mappedList);
    }
    if (prompts.isError) {
      setSnackbarMessage(t('promptsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [prompts.data?.content, prompts.isError, t]);

  // get all cnn model
  const [recognizerList, setRecognizerList] = useState<Data[]>([]);
  const [recognizersQuery] = useState<GetImageRecognizerQuery>({
    offset: 0,
    limit: 40,
  });
  const recognizers = useGetRecognizer(recognizersQuery!, {
    skip: !recognizersQuery,
  });
  useEffect(() => {
    if (recognizers.data?.content) {
      const mappedList: Data[] = recognizers.data.content.map(
        (item: ImageRecognizer) => ({
          label: item.name,
          value: item.id,
        })
      );
      setRecognizerList(mappedList);
    }
    if (recognizers.isError) {
      setSnackbarMessage(t('cnnLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [recognizers.data?.content, recognizers.isError, t]);

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
  }, [vectorStores.isError, t]);
  const vsData = useMemo(() => {
    if (!vectorStores.data?.content) return [];
    return vectorStores.data.content.map(
      (item: ChromaRetriever) =>
        ({
          label: item.name,
          value: item.id,
        } as Data)
    );
  }, [vectorStores.data?.content]);

  // GET all bm25s
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
  const bm25Data = useMemo(() => {
    if (!bm25s.data?.content) return [];
    return bm25s.data.content.map((item: BM25Retriever) => ({
      label: item.name,
      value: item.id,
    }));
  }, [bm25s.data?.content]);

  // GET all MCP
  const [mcpList, setMCPList] = useState<Data[]>([]);
  const [mcpQuery] = useState<GetMCPQuery>({
    offset: 0,
    limit: 40,
  });
  const mcps = useGetMCPs(mcpQuery!, {
    skip: !mcpQuery,
  });
  useEffect(() => {
    if (mcps.data?.content) {
      const mappedList: Data[] = mcps.data.content.map(
        (item: MCPStreamableServer) => ({
          label: item.name,
          value: item.id,
        })
      );
      setMCPList(mappedList);
    }
    if (mcps.isError) {
      setSnackbarMessage(t('mcpsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [mcps.data?.content, mcps.isError, t]);

  // get all tools
  const [toolList, setToolList] = useState<Data[]>([]);
  const [toolsQuery] = useState<GetToolQuery>({
    offset: 0,
    limit: 40,
  });
  const tools = useGetTools(toolsQuery!, {
    skip: !toolsQuery,
  });
  useEffect(() => {
    if (tools.data?.content) {
      const mappedList: Data[] = tools.data.content.map((item: Tool) => ({
        label: item.name,
        value: item.id,
      }));
      setToolList(mappedList);
    }
    if (tools.isError) {
      setSnackbarMessage(t('toolsLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [tools.isError, t, tools.data?.content]);

  //create Agent
  const [createAgentTrigger, createAgent] = useCreateAgent();
  const handleCreateAgentSubmit = async () => {
    // Validate required fields
    if (!agent.name.trim()) {
      setSnackbarMessage(t('agentNameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (!agent.language) {
      setSnackbarMessage(t('languageRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    if (!agent.prompt_id) {
      setSnackbarMessage(t('promptRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (!agent.llm_id) {
      setSnackbarMessage(t('llmModelRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    try {
      const newAgent: CreateAgentRequest = {
        name: agent.name,
        description: agent.description,
        language: agent.language,
        image_recognizer_id: agent.image_recognizer_id,
        retriever_ids: agent.retriever_ids,
        llm_id: agent.llm_id,
        prompt_id: agent.prompt_id,
        mcp_server_ids: agent.mcp_server_ids,
        tool_ids: agent.tool_ids,
      };

      await createAgentTrigger(newAgent).unwrap();
      setSnackbarMessage(t('createAgentSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.AGENT);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('createAgentFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };

  return (
    <Stack spacing={1}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('createAgent')}
      </Typography>

      {tools.isLoading ||
      mcps.isLoading ||
      bm25s.isLoading ||
      vectorStores.isLoading ||
      recognizers.isLoading ||
      prompts.isLoading ||
      chatModels.isLoading ? (
        <Loading />
      ) : (
        <Stack justifyContent={'center'} alignItems="center">
          <Stack spacing={2} width="100%">
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                required
                fullWidth
                size="small"
                helperText={t('hyperTextMedium')}
                label={t('agentName')}
                value={agent.name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (isValidLength(newValue, TextLength.MEDIUM))
                    setAgent((prev) => ({
                      ...prev,
                      name: newValue,
                    }));
                }}
                placeholder={`${t('enter')} ${t('agentName')}...`}
              />
              <SelectForm
                required
                isClearable={false}
                label={t('selectLanguage')}
                dataList={languageList}
                value={languageList.find(
                  (item) => item.value === agent.language
                )}
                onChange={(selected) => {
                  setAgent((prev) => ({
                    ...prev,
                    language: (selected as Data).value,
                  }));
                }}
              />
            </Stack>
            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'agentDescription'
              ).toLowerCase()}...`}
              label={t('agentDescription')}
              value={agent.description}
              helperText={t('hyperTextVeryLong')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setAgent((prev) => ({
                    ...prev,
                    description: newValue,
                  }));
              }}
              multiline
              rows={2}
            />
            <Stack spacing={2} direction={'row'} width="100%">
              <SelectForm
                required
                label={t('selectPrompt')}
                dataList={promptList}
                value={
                  promptList.find((item) => item.value === agent.prompt_id) ||
                  null
                }
                onChange={(selected) =>
                  setAgent((prev) => ({
                    ...prev,
                    prompt_id: (selected as Data).value,
                  }))
                }
              />
              <SelectForm
                label={t('selectRetrievers')}
                multiple={true}
                dataList={[...bm25Data, ...vsData]}
                value={[...bm25Data, ...vsData].filter((item) =>
                  agent.retriever_ids?.includes(item.value)
                )}
                onChange={(selected) =>
                  setAgent((prev) => ({
                    ...prev,
                    retriever_ids: (selected as Data[]).map(
                      (item) => item.value
                    ),
                  }))
                }
              />
            </Stack>
            <Stack spacing={2} direction={'row'} width="100%">
              <SelectForm
                label={t('selectRecognitionModel')}
                dataList={recognizerList}
                value={
                  recognizerList.find(
                    (item) => item.value === agent.image_recognizer_id
                  ) || null
                }
                onChange={(selected) =>
                  setAgent((prev) => ({
                    ...prev,
                    image_recognizer_id: (selected as Data).value,
                  }))
                }
              />
              <SelectForm
                required
                label={t('selectChatModel')}
                dataList={chatModelList}
                value={
                  chatModelList.find((item) => item.value === agent.llm_id) ||
                  null
                }
                onChange={(selected) =>
                  setAgent((prev) => ({
                    ...prev,
                    llm_id: (selected as Data).value,
                  }))
                }
              />
            </Stack>

            <Stack spacing={2} direction={'row'} width="100%">
              <SelectForm
                label={t('selectMCPModel')}
                multiple={true}
                dataList={mcpList}
                value={mcpList.filter((item) =>
                  agent.mcp_server_ids?.includes(item.value)
                )}
                onChange={(selected) =>
                  setAgent((prev) => ({
                    ...prev,
                    mcp_server_ids: (selected as Data[]).map(
                      (item) => item.value
                    ),
                  }))
                }
              />

              <SelectForm
                label={t('selectSearching')}
                multiple={true}
                dataList={toolList}
                value={toolList.filter((item) =>
                  agent.tool_ids?.includes(item.value)
                )}
                onChange={(selected) =>
                  setAgent((prev) => ({
                    ...prev,
                    tool_ids: (selected as Data[]).map((item) => item.value),
                  }))
                }
              />
            </Stack>

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateAgentSubmit}
                loading={createAgent.isLoading}
                disabled={createAgent.isSuccess}
              >
                {t('confirm')}
              </Button>
              <Button
                disabled={createAgent.isLoading || createAgent.isSuccess}
                variant="outlined"
                color="info"
                onClick={() => navigate(RoutePaths.AGENT)}
              >
                {t('cancel')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
