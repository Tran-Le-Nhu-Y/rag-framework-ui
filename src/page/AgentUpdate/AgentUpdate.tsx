import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import { InputFileUpload, SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function AgentUpdatePage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recognitionModel, setRecognitionModel] = useState('');
  const [provider, setProvider] = useState('');
  const [filteredContent, setFilteredContent] = useState('');
  const [filteredMode, setFilteredMode] = useState('');
  const [llm, setLlm] = useState('');
  //   const [vectorStoreName, setVectorStoreName] = useState('');
  //   const [searchToolName, setSearchToolName] = useState('');
  //   const [accessMethod, setAccessMethod] = useState('');
  //   const [searchingProvider, setSearchingProvider] = useState('');
  const [numberOfSearchingResults, setNumberOfSearchingResults] = useState('');
  const providerList: Data[] = [
    { label: 'OpenAI', value: 'OpenAI' },
    { label: 'Anthropic', value: 'Anthropic' },
    { label: 'Google', value: 'Google' },
  ];
  const filteredContentList: Data[] = [
    { label: 'Sexual', value: 'Sexual' },
    { label: 'Toxic', value: 'Toxic' },
  ];
  const filteredModeList: Data[] = [
    { label: 'Unspecified', value: 'Unspecified' },
  ];
  const llmListByProvider: Record<string, Data[]> = {
    OpenAI: [
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-3.5', value: 'gpt-3.5' },
    ],
    Anthropic: [
      { label: 'Claude 2', value: 'claude-2' },
      { label: 'Claude 3', value: 'claude-3' },
    ],
    Google: [
      { label: 'Gemini Pro', value: 'gemini-pro' },
      { label: 'Gemini Ultra', value: 'gemini-ultra' },
    ],
  };
  const recognitionModels: Data[] = [
    { label: 'White spot detector', value: 'white-spot' },
    { label: 'Color classifier', value: 'color-classifier' },
  ];
  const accessMethods: Data[] = [
    { label: 'Persistent', value: 'persistent' },
    { label: 'Remote', value: 'remote' },
  ];
  const vectorDBs: Data[] = [
    { label: 'Chroma', value: 'chroma' },
    { label: 'FAISS', value: 'faiss' },
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

  const [vectorStore, setVectorStore] = useState([
    {
      id: generateId(),
      name: '',
      provider: '',
      accessMethod: '',
    },
  ]);

  const handleAddVectorStore = () => {
    setVectorStore((prev) => [
      ...prev,
      {
        id: generateId(),
        name: '',
        provider: '',
        accessMethod: '',
      },
    ]);
  };

  const handleUpdateVectorStore = (
    id: string,
    field: string,
    value: unknown
  ) => {
    setVectorStore((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, [field]: value } : tool))
    );
  };
  const handleRemoveVectorStore = (id: string) => {
    setVectorStore((prev) => prev.filter((tool) => tool.id !== id));
  };

  return (
    <Stack spacing={1}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('updateAgent')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={4} width="100%">
          <Stack spacing={1}>
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
            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'promptConfig'
              ).toLowerCase()}...`}
              label={t('promptConfig')}
              value={description}
              helperText={t('hyperTextVeryLong')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setDescription(newValue);
              }}
              multiline
              rows={3}
            />
            <SelectForm
              label={t('selectRecognitionModel')}
              dataList={recognitionModels}
              value={
                recognitionModels.find(
                  (item) => item.value === recognitionModel
                ) || null
              }
              onChange={(selected) => {
                setRecognitionModel(selected?.value || '');
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
              <strong>{t('llmmodelConfiguration')}</strong>
            </Typography>

            <Stack>
              <Stack spacing={2} direction={'row'} padding={1}>
                <SelectForm
                  label={t('selectProvider')}
                  dataList={providerList}
                  value={
                    providerList.find((item) => item.value === provider) || null
                  }
                  onChange={(selected) => {
                    setProvider(selected?.value || '');
                    setLlm('');
                  }}
                />

                {provider && (
                  <SelectForm
                    label={t('selectLargeLanguageModel')}
                    dataList={llmListByProvider[provider] || []}
                    value={
                      (llmListByProvider[provider] || []).find(
                        (item) => item.value === llm
                      ) || null
                    }
                    onChange={(selected) => setLlm(selected?.value || '')}
                  />
                )}
              </Stack>
              <Stack spacing={2} direction={'row'} padding={1}>
                <SelectForm
                  label={t('filteredContent')}
                  dataList={filteredContentList}
                  value={
                    filteredContentList.find(
                      (item) => item.value === filteredContent
                    ) || null
                  }
                  onChange={(selected) => {
                    setFilteredContent(selected?.value || '');
                  }}
                />
                <SelectForm
                  label={t('filteredMode')}
                  dataList={filteredModeList}
                  value={
                    filteredModeList.find(
                      (item) => item.value === filteredMode
                    ) || null
                  }
                  onChange={(selected) => {
                    setFilteredMode(selected?.value || '');
                  }}
                />
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderColor: 'grey.400',
              borderRadius: 2,
              p: 2,
              position: 'relative',
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
              <strong>{t('textPreprocessingConfig')}</strong>
            </Typography>

            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <TextField
                label={t('numberOfDocumentReturn')}
                placeholder={t('enterNumberOfDocumentReturn')}
                // helperText={t('defaultNumber')}
                type="number"
                defaultValue={4}
                value={numberOfSearchingResults}
                onChange={(e) => setNumberOfSearchingResults(e.target.value)}
                fullWidth
                size="small"
              />
              <Stack
                direction={'row'}
                width={'100%'}
                spacing={2}
                height={'50%'}
                alignItems={'center'}
              >
                <Typography>{t('filterWordsFile')}:</Typography>
                <InputFileUpload
                  onFilesChange={function (): void {
                    throw new Error('Function not implemented.');
                  }}
                  acceptedFileTypes={['.pdf', '.txt']}
                />
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderColor: 'grey.400',
              borderRadius: 2,
              p: 2,
              position: 'relative',
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
              <strong>{t('embedModelConfiguration')}</strong>
            </Typography>

            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <SelectForm
                label={t('selectEmbedModel')}
                dataList={recognitionModels}
                value={
                  recognitionModels.find(
                    (item) => item.value === recognitionModel
                  ) || null
                }
                onChange={(selected) => {
                  setRecognitionModel(selected?.value || '');
                }}
              />
              <SelectForm
                label={t('selectProvider')}
                dataList={recognitionModels}
                value={
                  recognitionModels.find(
                    (item) => item.value === recognitionModel
                  ) || null
                }
                onChange={(selected) => {
                  setRecognitionModel(selected?.value || '');
                }}
              />
            </Stack>
          </Box>

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
                      selected?.value || ''
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
                <AddCircleIcon />
              </Button>
            </Box>
          </Box>
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
              <strong>{t('vectorStoreConfig')}</strong>
            </Typography>
            {vectorStore.map((vectorDB, index) => (
              <Stack
                key={vectorDB.id}
                direction={'row'}
                spacing={2}
                alignItems={'center'}
                mb={2}
              >
                <Typography>{index + 1}.</Typography>
                <TextField
                  label={t('vectorDBName')}
                  placeholder={t('vectorDBName')}
                  type="text"
                  value={vectorDB.name}
                  onChange={(e) =>
                    handleUpdateVectorStore(vectorDB.id, 'name', e.target.value)
                  }
                  fullWidth
                  size="small"
                />
                <SelectForm
                  label={t('seclectVectorDB')}
                  dataList={vectorDBs}
                  value={
                    vectorDBs.find(
                      (item) => item.value === vectorDB.provider
                    ) || null
                  }
                  onChange={(selected) => {
                    handleUpdateVectorStore(
                      vectorDB.id,
                      'provider',
                      selected?.value || ''
                    );
                  }}
                />
                <SelectForm
                  label={t('selectAccessMethod')}
                  dataList={accessMethods}
                  value={
                    accessMethods.find(
                      (item) => item.value === vectorDB.accessMethod
                    ) || null
                  }
                  onChange={(selected) => {
                    handleUpdateVectorStore(
                      vectorDB.id,
                      'accessMethod',
                      selected?.value || ''
                    );
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveVectorStore(vectorDB.id)}
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
              <Button variant="contained" onClick={handleAddVectorStore}>
                <AddCircleIcon />
              </Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary" onClick={() => {}}>
              {t('confirm')}
            </Button>
            <Button variant="outlined" color="info" onClick={() => {}}>
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
