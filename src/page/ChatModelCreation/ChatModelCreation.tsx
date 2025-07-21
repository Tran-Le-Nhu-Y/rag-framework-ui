import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  HideDuration,
  isValidLength,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { AppSnackbar, SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';
import { useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useCreateChatModel } from '../../service';

export default function ChatModelCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [modelName, setModelName] = useState('');
  const [provider, setProvider] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(0.5);
  const [topK, setTopK] = useState<number | null>(40);
  const [topP, setTopP] = useState<number | null>(null);
  const providerList: Data[] = [
    { label: 'Ollama', value: 'ollama' },
    { label: 'Google Gen AI', value: 'google_genai' },
  ];

  // ollama
  const [baseUrl, setBaseUrl] = useState('');
  const [seed, setSeed] = useState<number | null>(null);
  const [numCtx, setNumCtx] = useState<number>(2048);
  const [numPredict, setNumPredict] = useState<number | null>(128);
  const [repeatPenalty, setRepeatPenalty] = useState<number | null>(1.1);
  const [stop, setStop] = useState<string>('');

  // google gen ai
  const [maxTokens, setMaxTokens] = useState<number>(1024);
  const [maxRetries, setMaxRetries] = useState<number>(6);
  const [timeout, setTimeoutVal] = useState<number | null>(null);
  const safetyOptions = [
    'UNSPECIFIED',
    'DEROGATORY',
    'TOXICITY',
    'VIOLENCE',
    'SEXUAL',
    'MEDICAL',
    'DANGEROUS',
    'HARASSMENT',
    'HATE_SPEECH',
    'SEXUALLY_EXPLICIT',
    'DANGEROUS_CONTENT',
    'CIVIC_INTEGRITY',
  ];
  const safetyLevels = [
    'BLOCK_LOW_AND_ABOVE',
    'BLOCK_MEDIUM_AND_ABOVE',
    'BLOCK_ONLY_HIGH',
    'BLOCK_NONE',
    'OFF',
  ];
  const [safetySettingsList, setSafetySettingsList] = useState<
    { category: string; level: string }[]
  >([]);

  const handleAddSafetySetting = () => {
    if (safetySettingsList.length < 12) {
      setSafetySettingsList([
        ...safetySettingsList,
        { category: '', level: '' },
      ]);
    }
  };

  const handleUpdateSafetySetting = (
    index: number,
    key: 'category' | 'level',
    value: string
  ) => {
    const updated = [...safetySettingsList];
    updated[index][key] = value;
    setSafetySettingsList(updated);
  };

  const handleRemoveSafetySetting = (index: number) => {
    setSafetySettingsList(safetySettingsList.filter((_, i) => i !== index));
  };

  const safetySettingsObject: Record<string, string> = {};
  safetySettingsList.forEach(({ category, level }) => {
    if (category && level) {
      safetySettingsObject[category] = level;
    }
  });

  useEffect(() => {
    if (provider === 'google_genai') {
      setTemperature(0.5);
      setMaxTokens((prev) => (prev >= 10 ? prev : 1024));
      setMaxRetries((prev) => (prev >= 0 ? prev : 6));
    } else if (provider === 'ollama') {
      setTemperature(0.8);
    }
  }, [provider]);

  const [createChatModelTrigger, chatModel] = useCreateChatModel();
  useEffect(() => {
    if (chatModel.isError) {
      setSnackbarMessage(t('createPromptError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    } else if (chatModel.isSuccess) {
      setSnackbarMessage(t('createPromptSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.CHATMODEL);
      }, 1000);
    }
  }, [chatModel.isError, chatModel.isSuccess, navigate, t]);

  const handleCreateChatModelSubmit = async () => {
    try {
      const base = {
        model_name: modelName,
        provider: provider,
        temperature: temperature,
        top_k: topK,
        top_p: topP,
      };

      let newChatModel: CreateChatModelRequest;

      if (provider === 'ollama') {
        newChatModel = {
          ...base,
          type: 'ollama',
          base_url: baseUrl,
          seed,
          num_ctx: numCtx,
          num_predict: numPredict,
          repeat_penalty: repeatPenalty,
          stop: stop ? stop.split(',').map((s) => s.trim()) : null,
        };
      } else if (provider === 'google_genai') {
        newChatModel = {
          ...base,
          type: 'google_genai',
          max_tokens: maxTokens,
          max_retries: maxRetries,
          timeout,
          safety_settings: safetySettingsObject,
        };
      } else {
        setSnackbarMessage(t('missingProviderType'));
        setSnackbarSeverity(SnackbarSeverity.ERROR);
        setSnackbarOpen(true);
        return;
      }

      await createChatModelTrigger(newChatModel);
      setSnackbarMessage(t('createChatModelSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      navigate(RoutePaths.CHATMODEL);
    } catch (error) {
      console.error('Creating chat model error:', error);
      setSnackbarMessage(t('createChatModelError'));
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
                    providerList.find((item) => item.value === provider) || null
                  }
                  onChange={(selected) => {
                    setProvider((selected as Data | null)?.value || '');
                  }}
                />
              </Stack>

              <Stack direction={'row'} spacing={2} width="100%">
                <TextField
                  fullWidth
                  size="small"
                  label={t('topK')}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: 1,
                  }}
                  value={topK ?? ''}
                  onChange={(e) => setTopK(Number(e.target.value) || null)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label={t('topP') + ' [0-1]'}
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 1,
                    step: 0.1,
                  }}
                  value={topP ?? ''}
                  onChange={(e) => setTopP(Number(e.target.value) || null)}
                />
              </Stack>

              {/* Dynamic fields */}
              {provider === 'ollama' && (
                <>
                  <TextField
                    size="small"
                    label={t('baseURL')}
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                  />
                  <Stack direction={'row'} spacing={2} width="100%">
                    <TextField
                      fullWidth
                      size="small"
                      label={t('temperature') + ' [0-1]'}
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 1,
                        step: 0.1,
                      }}
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label={t('seed')}
                      type="number"
                      value={seed ?? ''}
                      onChange={(e) => setSeed(Number(e.target.value) || null)}
                    />
                  </Stack>
                  <Stack direction={'row'} spacing={2} width="100%">
                    <TextField
                      fullWidth
                      size="small"
                      label={t('numCtx')}
                      type="number"
                      inputProps={{
                        min: 0,
                        step: 1,
                      }}
                      value={numCtx}
                      onChange={(e) => setNumCtx(Number(e.target.value))}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('numPredict')}
                      type="number"
                      inputProps={{
                        min: 0,
                        step: 1,
                      }}
                      value={numPredict ?? ''}
                      onChange={(e) =>
                        setNumPredict(Number(e.target.value) || null)
                      }
                    />
                  </Stack>
                  <Stack direction={'row'} spacing={2} width="100%">
                    <TextField
                      fullWidth
                      size="small"
                      label={t('repeatPenalty') + ' [0-2]'}
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 2,
                        step: 0.1,
                      }}
                      value={repeatPenalty ?? ''}
                      onChange={(e) =>
                        setRepeatPenalty(Number(e.target.value) || null)
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('stop')}
                      placeholder="comma,separated,values"
                      value={stop}
                      onChange={(e) => setStop(e.target.value)}
                    />
                  </Stack>
                </>
              )}

              {provider === 'google_genai' && (
                <>
                  <Stack direction={'row'} spacing={2} width="100%">
                    <TextField
                      fullWidth
                      size="small"
                      label={t('temperature') + ' [0-2]'}
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 2,
                        step: 0.1,
                      }}
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('maxTokens')}
                      type="number"
                      inputProps={{ min: 10 }}
                      value={maxTokens}
                      onChange={(e) =>
                        setMaxTokens(Math.max(10, Number(e.target.value)))
                      }
                    />
                  </Stack>
                  <Stack direction={'row'} spacing={2} width="100%">
                    <TextField
                      fullWidth
                      size="small"
                      label={t('maxRetries')}
                      type="number"
                      inputProps={{ min: 0 }}
                      value={maxRetries}
                      onChange={(e) =>
                        setMaxRetries(Math.max(0, Number(e.target.value)))
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('timeout')}
                      type="number"
                      value={timeout ?? ''}
                      onChange={(e) =>
                        setTimeoutVal(Number(e.target.value) || null)
                      }
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
                      <strong>{t('safetySettings')}</strong>
                    </Typography>

                    {safetySettingsList.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                      >
                        <Typography>{index + 1}.</Typography>
                        <SelectForm
                          label={t('category')}
                          dataList={safetyOptions
                            .filter(
                              (opt) =>
                                opt === item.category ||
                                !safetySettingsList.some(
                                  (i) => i.category === opt
                                )
                            )
                            .map((opt) => ({ label: opt, value: opt }))}
                          value={
                            item.category
                              ? { label: item.category, value: item.category }
                              : null
                          }
                          onChange={(selected) =>
                            handleUpdateSafetySetting(
                              index,
                              'category',
                              (selected as Data | null)?.value || ''
                            )
                          }
                        />
                        <SelectForm
                          label={t('level')}
                          dataList={safetyLevels.map((level) => ({
                            label: level,
                            value: level,
                          }))}
                          value={
                            item.level
                              ? { label: item.level, value: item.level }
                              : null
                          }
                          onChange={(selected) =>
                            handleUpdateSafetySetting(
                              index,
                              'level',
                              (selected as Data | null)?.value || ''
                            )
                          }
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveSafetySetting(index)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Stack>
                    ))}

                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={handleAddSafetySetting}
                        disabled={safetySettingsList.length >= 12}
                      >
                        <Tooltip title={t('addSafetySetting')}>
                          <AddCircleIcon />
                        </Tooltip>
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Stack>
          </Stack>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateChatModelSubmit}
            >
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
