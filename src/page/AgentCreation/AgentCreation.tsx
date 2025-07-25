import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import type { Data } from '../../component/SelectForm';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router';
import SelectForm from '../../component/SelectForm';

export default function AgentCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recognitionModel, setRecognitionModel] = useState<string>('');
  const [prompt, setPrompt] = useState<string[]>([]);

  const recognitionModels: Data[] = [
    { label: 'White spot detector', value: 'white-spot' },
    { label: 'Color classifier', value: 'color-classifier' },
  ];
  const prompts: Data[] = [
    { label: 'Test 1', value: 'Test 1' },
    { label: 'Test 2', value: 'Test 2' },
  ];

  const searchingProviders: Data[] = [
    { label: 'DuckDuckGo ', value: 'duckduckgo' },
    { label: 'Google', value: 'google' },
    { label: 'Bing', value: 'bing' },
  ];

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const [searchTools, setSearchTools] = useState([
    {
      id: generateId(),
      name: '',
      provider: '',
      maxResults: 4,
    },
  ]);

  const handleAddSearchTool = () => {
    setSearchTools((prev) => [
      ...prev,
      {
        id: generateId(),
        name: '',
        provider: '',
        maxResults: 4,
      },
    ]);
  };

  const handleUpdateTool = (id: string, field: string, value: unknown) => {
    setSearchTools((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, [field]: value } : tool))
    );
  };
  const handleRemoveSearchTool = (id: string) => {
    setSearchTools((prev) => prev.filter((tool) => tool.id !== id));
  };

  return (
    <Stack spacing={1}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('createAgent')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="100%">
          <Stack width="100%">
            <TextField
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('agentName')}
              value={name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setName(newValue);
              }}
              placeholder={`${t('enter')} ${t('agentName').toLowerCase()}...`}
            />

            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'agentDescription'
              ).toLowerCase()}...`}
              label={t('agentDescription')}
              value={description}
              helperText={t('hyperTextVeryLong')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setDescription(newValue);
              }}
              multiline
              rows={2}
            />
          </Stack>
          <Stack spacing={2} direction={'row'} width="100%">
            <SelectForm
              label={t('selectPrompt')}
              multiple={true}
              dataList={prompts}
              value={prompts.filter((item) => prompt.includes(item.value))}
              onChange={(selected) =>
                setPrompt(
                  Array.isArray(selected)
                    ? selected.map((item) => item.value)
                    : []
                )
              }
            />
            <SelectForm
              label={t('selectVectorStore')}
              dataList={recognitionModels}
              value={
                recognitionModels.find(
                  (item) => item.value === recognitionModel
                ) || null
              }
              onChange={(selected) => {
                setRecognitionModel((selected as Data | null)?.value || '');
              }}
            />
          </Stack>
          <Stack spacing={2} direction={'row'} width="100%">
            <SelectForm
              label={t('selectRecognitionModel')}
              dataList={recognitionModels}
              value={
                recognitionModels.find(
                  (item) => item.value === recognitionModel
                ) || null
              }
              onChange={(selected) => {
                setRecognitionModel((selected as Data | null)?.value || '');
              }}
            />
            <SelectForm
              label={t('selectChatModel')}
              dataList={recognitionModels}
              value={
                recognitionModels.find(
                  (item) => item.value === recognitionModel
                ) || null
              }
              onChange={(selected) => {
                setRecognitionModel((selected as Data | null)?.value || '');
              }}
            />
          </Stack>

          <Stack spacing={2} direction={'row'} width="100%">
            <SelectForm
              label={t('selectMCPModel')}
              dataList={recognitionModels}
              value={
                recognitionModels.find(
                  (item) => item.value === recognitionModel
                ) || null
              }
              onChange={(selected) => {
                setRecognitionModel((selected as Data | null)?.value || '');
              }}
            />
            <SelectForm
              label={t('selectLanguage')}
              dataList={recognitionModels}
              value={
                recognitionModels.find(
                  (item) => item.value === recognitionModel
                ) || null
              }
              onChange={(selected) => {
                setRecognitionModel((selected as Data | null)?.value || '');
              }}
            />
          </Stack>

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderColor: 'grey.400',
              borderRadius: 2,
              p: 2,
              position: 'relative',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                position: 'absolute',
                top: 0,
                left: 12,
                transform: 'translateY(-50%)',
                backgroundColor: 'background.paper',
                px: 1,
              }}
            >
              <strong>{t('searchToolConfig')}</strong>
            </Typography>
            {searchTools.map((tool, index) => (
              <Stack
                key={tool.id}
                direction={'row'}
                spacing={2}
                alignItems={'center'}
                mb={2}
              >
                <Typography>{index + 1}.</Typography>
                <TextField
                  label={t('searchToolName')}
                  placeholder={t('searchToolName')}
                  type="text"
                  value={tool.name}
                  onChange={(e) =>
                    handleUpdateTool(tool.id, 'name', e.target.value)
                  }
                  fullWidth
                  size="small"
                />
                <SelectForm
                  label={t('selectSearchingProvider')}
                  dataList={searchingProviders}
                  value={
                    searchingProviders.find(
                      (item) => item.value === tool.provider
                    ) || null
                  }
                  onChange={(selected) => {
                    handleUpdateTool(
                      tool.id,
                      'provider',
                      (selected as Data | null)?.value || ''
                    );
                  }}
                />
                <TextField
                  label={t('theMaximunNumberOfSearchingResults')}
                  placeholder={t('enterTheMaximunNumberOfSearchingResults')}
                  type="number"
                  value={tool.maxResults}
                  onChange={(e) =>
                    handleUpdateTool(
                      tool.id,
                      'maxResults',
                      parseInt(e.target.value)
                    )
                  }
                  fullWidth
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveSearchTool(tool.id)}
                >
                  <DeleteIcon />
                </Button>
              </Stack>
            ))}
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Button variant="contained" onClick={handleAddSearchTool}>
                <Tooltip title={t('addSearchTool')}>
                  <AddCircleIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary" onClick={() => {}}>
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(-1)}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
