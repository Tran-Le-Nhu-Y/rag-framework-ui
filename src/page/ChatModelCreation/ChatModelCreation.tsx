import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  isValidLength,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';
import { useNavigate } from 'react-router';
import { useCreateChatModel } from '../../service';
import { useSnackbar } from '../../hook';
import CreateOllamaProperties, {
  type OllamaChatModelAdditionalProperties,
} from './CreateOllamaProperties';
import CreateGoogleGenAIProperties, {
  type GoogleGenAIChatModelAdditionalProperties,
} from './CreateGoogleGenAIProperties';

const providerList: Data[] = [
  { label: 'Ollama', value: 'ollama' },
  { label: 'Google Generative AI', value: 'google_genai' },
];

function convertToChatModelType(value: string): ChatModelType {
  let type: ChatModelType = 'google_genai';
  if (value.localeCompare('ollama') === 0) type = 'ollama';
  return type;
}

export default function ChatModelCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const [modelName, setModelName] = useState('');
  const [type, setType] = useState<ChatModelType>('google_genai');

  // ollama
  const [ollamaProps, setOllamaProps] =
    useState<OllamaChatModelAdditionalProperties>({
      temperature: 0.5,
      base_url: '',
      seed: null,
      top_k: null,
      top_p: null,
      num_ctx: 2048,
      num_predict: 128,
      repeat_penalty: 1.1,
      stop: '',
    });

  // google_genai
  const [googleGenAIProps, setGoogleGenAIProps] =
    useState<GoogleGenAIChatModelAdditionalProperties>({
      temperature: 0.5,
      top_k: null,
      top_p: null,
      max_tokens: 1024,
      max_retries: 6,
      timeout: null,
      safety_settings: null,
    });

  const [createChatModelTrigger, chatModel] = useCreateChatModel();
  const handleCreateChatModelSubmit = async () => {
    const base = {
      model_name: modelName,
      provider: type,
    };

    let newChatModel: CreateChatModelRequest;
    if (type === 'ollama') {
      newChatModel = {
        ...base,
        type: 'ollama',
        ...ollamaProps,
        stop: ollamaProps.stop
          ? ollamaProps.stop.split(',').map((s) => s.trim())
          : null,
      };
    } else if (type === 'google_genai') {
      const safetySettings = googleGenAIProps.safety_settings?.reduce(
        (acc, curr) => {
          return { ...acc, [curr.category]: curr.threshold };
        },
        {}
      );
      newChatModel = {
        ...base,
        type: 'google_genai',
        top_k: googleGenAIProps.top_k,
        top_p: googleGenAIProps.top_p,
        temperature: googleGenAIProps.temperature,
        max_retries: googleGenAIProps.max_retries,
        max_tokens: googleGenAIProps.max_tokens,
        timeout: googleGenAIProps.timeout,
        safety_settings:
          safetySettings !== undefined
            ? (safetySettings as Record<HarmCategory, HarmBlockThreshold>)
            : null,
      };
    } else {
      showSnackbar({
        message: t('missingProviderType'),
        severity: SnackbarSeverity.ERROR,
      });
      return;
    }

    try {
      await createChatModelTrigger(newChatModel).unwrap();
      showSnackbar({
        message: t('createChatModelSuccess'),
        severity: SnackbarSeverity.SUCCESS,
      });
      navigate(RoutePaths.CHAT_MODEL);
    } catch (error) {
      console.error('Creating chat model error:', error);
      showSnackbar({
        message: t('createChatModelError'),
        severity: SnackbarSeverity.ERROR,
      });
    }
  };

  return (
    <Stack spacing={1}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('createChatModel')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={4} width="100%">
          <Stack spacing={2} direction={'row'} width="100%">
            <Stack width="100%" spacing={2}>
              <Stack direction={'row'} spacing={2} width="100%">
                <TextField
                  fullWidth
                  size="small"
                  helperText={t('hyperTextMedium')}
                  label={t('modelName')}
                  value={modelName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (isValidLength(newValue, TextLength.MEDIUM))
                      setModelName(newValue);
                  }}
                  placeholder={`${t('enter')} ${t(
                    'modelName'
                  ).toLowerCase()}...`}
                />
                <SelectForm
                  label={t('selectProvider')}
                  dataList={providerList}
                  value={
                    providerList.find((item) => item.value === type) || null
                  }
                  onChange={(selected) => {
                    const selectedValue = convertToChatModelType(
                      (selected as Data | null)?.value || ''
                    );
                    setType(selectedValue);
                  }}
                />
              </Stack>

              {/* Dynamic fields */}
              {type === 'ollama' && (
                <CreateOllamaProperties
                  value={ollamaProps}
                  onChange={(value) => setOllamaProps(value)}
                />
              )}
              {type === 'google_genai' && (
                <CreateGoogleGenAIProperties
                  value={googleGenAIProps}
                  onChange={(value) => setGoogleGenAIProps(value)}
                />
              )}
            </Stack>
          </Stack>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              loading={chatModel.isLoading}
              onClick={handleCreateChatModelSubmit}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              disabled={chatModel.isLoading}
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
