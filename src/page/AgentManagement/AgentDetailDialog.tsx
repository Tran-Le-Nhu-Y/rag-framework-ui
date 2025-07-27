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

export default function AgentDetailDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  const fakeAgent = {
    id: 'agent-001',
    name: 'ShrimpAgent Alpha',
    description:
      'An agent for detecting white spot disease.This agent helps detect white spot disease and gives treatment advice.',
    recognitionModel: 'White Spot Detector v1.0',
    language: 'English',
    chatModel: 'Gemini-Pro-1.5',
    mcpModel: 'Shrimp Knowledge MCP v1',
    retriever: 'BM25 Retriever',
    searchings: ['Similarity Search', 'Similarity Search'],
    prompt: 'Initial Diagnosis',
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('agentDetailInformation')}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight="bold">{t('agentName')}:</Typography>
              <Typography>{fakeAgent.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight="bold">{t('language')}:</Typography>
              <Typography>{fakeAgent.language}</Typography>
            </Stack>
          </Box>

          <Stack spacing={1}>
            <Typography fontWeight="bold">{t('agentDescription')}:</Typography>
            <Box sx={{ textAlign: 'justify' }}>
              <Typography>{fakeAgent.description}</Typography>
            </Box>
          </Stack>

          <Divider />
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('promptConfig')}:</Typography>
            <Typography>{fakeAgent.prompt}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('chatModelConfig')}:</Typography>
            <Typography>{fakeAgent.chatModel}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('cnnModelConfig')}:</Typography>
            <Typography>{fakeAgent.recognitionModel}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">
              {t('retrieverModelConfig')}:
            </Typography>
            <Typography>{fakeAgent.retriever}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('mcpModelConfig')}:</Typography>
            <Typography>{fakeAgent.mcpModel}</Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Typography fontWeight="bold">{t('promptConfig')}:</Typography>
            <Typography>{fakeAgent.searchings.join(', ')}</Typography>
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
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
