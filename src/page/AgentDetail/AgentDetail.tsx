import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { SaveAlt, Edit } from '@mui/icons-material';

export default function AgentDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fake agent data
  const fakeAgent = {
    id: 'agent-001',
    name: 'ShrimpAgent Alpha',
    description:
      'This agent helps detect white spot disease and gives treatment advice.',
    recognitionModel: 'White Spot Detector v1.0',
    language: 'English',
    chatModel: 'Gemini-Pro-1.5',
    mcpModel: 'Shrimp Knowledge MCP v1',
    retriever: 'BM25 Retriever',
    searching: 'Similarity Search',
    prompts: ['Initial Diagnosis', 'Emergency Treatment'],
    modelFile: {
      name: 'white-spot-model-v1.onnx',
      url: '/models/white-spot-model-v1.onnx',
    },
    classFile: {
      name: 'classes.json',
      url: '/files/classes.json',
    },
  };

  const handleExport = () => {
    const json = JSON.stringify(fakeAgent, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fakeAgent.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEdit = () => {
    navigate(`/agent/update/${fakeAgent.id}`);
  };

  return (
    <Box pl={5} pr={5}>
      <Stack spacing={3}>
        <Typography variant="h4" textAlign="center">
          {t('agentDetailInformation')}
        </Typography>

        <Stack direction={'row'} spacing={2} width={'100%'}>
          <Stack direction={'row'} spacing={2} width={'100%'}>
            <Typography fontWeight="bold">{t('agentName')}:</Typography>
            <Typography variant="body1">{fakeAgent.name}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={2} width={'100%'}>
            <Typography fontWeight="bold">{t('language')}:</Typography>
            <Typography variant="body1">{fakeAgent.language}</Typography>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {t('agentDescription')}
          </Typography>
          <Typography variant="body1">{fakeAgent.description}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {t('selectPrompt')}
          </Typography>
          <Typography variant="body1">
            {fakeAgent.prompts.join(', ')}
          </Typography>
        </Box>

        <Divider />

        <Stack direction="row" spacing={4}>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('selectRecognitionModel')}
            </Typography>
            <Typography>{fakeAgent.recognitionModel}</Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('selectChatModel')}
            </Typography>
            <Typography>{fakeAgent.chatModel}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={4}>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('selectMCPModel')}
            </Typography>
            <Typography>{fakeAgent.mcpModel}</Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('selectRetrievers')}
            </Typography>
            <Typography>{fakeAgent.retriever}</Typography>
          </Box>
        </Stack>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {t('selectSearching')}
          </Typography>
          <Typography>{fakeAgent.searching}</Typography>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button variant="contained" onClick={() => navigate(-1)}>
            {t('goBack')}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleEdit}
            startIcon={<Edit />}
          >
            {t('update')}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleExport}
            startIcon={<SaveAlt />}
          >
            {t('export')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
