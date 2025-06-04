import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import { SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';

export default function AgentCreationPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recognitionModel, setRecognitionModel] = useState('');
  const [provider, setProvider] = useState('');
  const [llm, setLlm] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [accessMethod, setAccessMethod] = useState('');
  const [vectorDB, setVectorDB] = useState('');
  const [textPreprocessingMode, setTextPreprocessingMode] = useState('');
  const [searchingProvider, setSearchingProvider] = useState('');
  const [numberOfSearchingResults, setNumberOfSearchingResults] = useState('');
  const providerList: Data[] = [
    { label: 'OpenAI', value: 'OpenAI' },
    { label: 'Anthropic', value: 'Anthropic' },
    { label: 'Google', value: 'Google' },
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
  const textPreprocessingModes: Data[] = [
    { label: 'Default', value: 'default' },
    { label: 'NLTK Punkt Tokenizer', value: 'nltk-punkt-tokenizer' },
  ];
  const searchingProviders: Data[] = [
    { label: 'DuckDuckGo ', value: 'duckduckgo' },
    { label: 'Google', value: 'google' },
    { label: 'Bing', value: 'bing' },
  ];

  return (
    <Stack spacing={1}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('createAgent')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="100%">
          <TextField
            size="small"
            helperText={t('hyperTextMedium')}
            label={t('agentName')}
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.MEDIUM)) setName(newValue);
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
          <Stack direction={'row'} spacing={2} width="100%">
            <Stack spacing={2} width="50%">
              <SelectForm
                label={t('selectProvider')}
                dataList={providerList}
                value={
                  providerList.find((item) => item.value === provider) || null
                }
                onChange={(selected) => {
                  setProvider(selected?.value || '');
                  setLlm('');
                  setApiKey('');
                }}
              />
              {provider && (
                <>
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

                  <TextField
                    label={t('apiKey')}
                    placeholder={t('enterApiKey')}
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </>
              )}
            </Stack>
            <Stack spacing={2} width="50%">
              <SelectForm
                label={t('seclectVectorDB')}
                dataList={vectorDBs}
                value={
                  vectorDBs.find((item) => item.value === vectorDB) || null
                }
                onChange={(selected) => {
                  setVectorDB(selected?.value || '');
                }}
              />
              <SelectForm
                label={t('selectAccessMethod')}
                dataList={accessMethods}
                value={
                  accessMethods.find((item) => item.value === accessMethod) ||
                  null
                }
                onChange={(selected) => {
                  setAccessMethod(selected?.value || '');
                }}
              />
              <SelectForm
                label={t('selectTextPreprocessingMode')}
                dataList={textPreprocessingModes}
                value={
                  textPreprocessingModes.find(
                    (item) => item.value === textPreprocessingMode
                  ) || null
                }
                onChange={(selected) => {
                  setTextPreprocessingMode(selected?.value || '');
                }}
              />
              <TextField
                label={t('numberOfDocumentReturn')}
                placeholder={t('enterNumberOfDocumentReturn')}
                helperText={t('defaultNumber')}
                type="number"
                defaultValue={4}
                value={numberOfSearchingResults}
                onChange={(e) => setNumberOfSearchingResults(e.target.value)}
                fullWidth
                size="small"
              />
            </Stack>
            <Stack spacing={2} width="50%">
              <SelectForm
                label={t('selectSearchingProvider')}
                dataList={searchingProviders}
                value={
                  searchingProviders.find(
                    (item) => item.value === searchingProvider
                  ) || null
                }
                onChange={(selected) => {
                  setSearchingProvider(selected?.value || '');
                }}
              />
              <TextField
                label={t('theMaximunNumberOfSearchingResults')}
                placeholder={t('enterTheMaximunNumberOfSearchingResults')}
                helperText={t('defaultNumber')}
                type="number"
                defaultValue={4}
                value={numberOfSearchingResults}
                onChange={(e) => setNumberOfSearchingResults(e.target.value)}
                fullWidth
                size="small"
              />
            </Stack>
          </Stack>

          <Box mt={3} display="flex" justifyContent="center" gap={2}>
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
