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
import { PathHolders, RoutePaths, SnackbarSeverity } from '../../util';
import { SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';
import { useNavigate, useParams } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useGetChatModelById, useUpdateChatModel } from '../../service';
import { useSnackbar } from '../../hook';

const providerList: Data[] = [
  { label: 'Ollama', value: 'ollama' },
  { label: 'Google Gen AI', value: 'google_genai' },
];
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

export default function ChatModelUpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const chatModelId = useParams()[PathHolders.CHAT_MODEL_ID];

  const [chatModel, setChatModel] = useState<
    Partial<OllamaChatModel> & Partial<GoogleGenAIChatModel>
  >({});
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

  const chatModelDetail = useGetChatModelById(chatModelId!, {
    skip: !chatModelId,
  });
  const [updateChatModelTrigger] = useUpdateChatModel();
  useEffect(() => {
    if (chatModelDetail.data) {
      const model = chatModelDetail.data;
      setChatModel({ ...model } as Partial<OllamaChatModel> &
        Partial<GoogleGenAIChatModel>);

      if (model.type === 'google_genai' && model.safetySettings) {
        setSafetySettingsList(
          Object.entries(model.safetySettings).map(([category, level]) => ({
            category,
            level,
          }))
        );
      }
    }
  }, [chatModelDetail.data]);

  const updateModel = <K extends keyof typeof chatModel>(
    key: K,
    value: (typeof chatModel)[K]
  ) => {
    setChatModel((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const safety_settings: Record<string, string> = {};
    if (chatModel.type === 'google_genai') {
      safetySettingsList.forEach(({ category, level }) => {
        if (category && level) {
          safety_settings[category] = level;
        }
      });
    }

    const payload: UpdateChatModelRequest = {
      ...(chatModel as ChatModel),
      chatModelId: chatModelId!,
      ...(chatModel.type === 'google_genai' ? { safety_settings } : {}),
    };

    try {
      await updateChatModelTrigger(payload);
      showSnackbar({
        message: t('updateChatModelSuccess'),
        severity: SnackbarSeverity.SUCCESS,
      });
      setTimeout(() => {
        navigate(RoutePaths.CHAT_MODEL);
      }, 1000);
    } catch {
      showSnackbar({
        message: t('updateChatModelFail'),
        severity: SnackbarSeverity.ERROR,
      });
    }
  };
  if (chatModelDetail.isLoading) return <Typography>Loading...</Typography>;

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
                  value={chatModel.modelName || ''}
                  onChange={(e) => updateModel('model_name', e.target.value)}
                  placeholder={`${t('enter')} ${t(
                    'modelName'
                  ).toLowerCase()}...`}
                />
                <SelectForm
                  label={t('selectProvider')}
                  dataList={providerList}
                  value={
                    providerList.find(
                      (item) => item.value === chatModel.provider
                    ) || null
                  }
                  onChange={(selected) => {
                    updateModel(
                      'provider',
                      (selected as Data | null)?.value || ''
                    );
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
                  value={chatModel.topK ?? ''}
                  onChange={(e) =>
                    updateModel('top_k', Number(e.target.value) || null)
                  }
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
                  value={chatModel.topP ?? ''}
                  onChange={(e) =>
                    updateModel('top_p', Number(e.target.value) || null)
                  }
                />
              </Stack>

              {/* Dynamic fields */}
              {chatModel.type === 'ollama' && (
                <>
                  <TextField
                    size="small"
                    label={t('baseURL')}
                    value={chatModel.baseUrl || ''}
                    onChange={(e) => updateModel('base_url', e.target.value)}
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
                      value={chatModel.temperature ?? 0.8}
                      onChange={(e) =>
                        updateModel('temperature', Number(e.target.value))
                      }
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label={t('seed')}
                      type="number"
                      value={chatModel.seed ?? ''}
                      onChange={(e) =>
                        updateModel('seed', Number(e.target.value) || null)
                      }
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
                      value={chatModel.numCtx ?? 2048}
                      onChange={(e) =>
                        updateModel('num_ctx', Number(e.target.value))
                      }
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
                      value={chatModel.numPredict ?? 128}
                      onChange={(e) =>
                        updateModel(
                          'num_predict',
                          Number(e.target.value) || null
                        )
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
                      value={chatModel.repeatPenalty ?? 1.1}
                      onChange={(e) =>
                        updateModel(
                          'repeat_penalty',
                          Number(e.target.value) || null
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('stop')}
                      placeholder="comma,separated,values"
                      value={chatModel.stop?.join(', ') || ''}
                      onChange={(e) =>
                        updateModel(
                          'stop',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                    />
                  </Stack>
                </>
              )}

              {chatModel.type === 'google_genai' && (
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
                      value={chatModel.temperature ?? 0.5}
                      onChange={(e) =>
                        updateModel('temperature', Number(e.target.value))
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('maxTokens')}
                      type="number"
                      inputProps={{ min: 10 }}
                      value={chatModel.maxTokens ?? 1024}
                      onChange={(e) =>
                        updateModel(
                          'max_tokens',
                          Math.max(10, Number(e.target.value))
                        )
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
                      value={chatModel.maxRetries ?? 6}
                      onChange={(e) =>
                        updateModel(
                          'max_retries',
                          Math.max(0, Number(e.target.value))
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={t('timeout')}
                      type="number"
                      value={chatModel.timeout ?? ''}
                      onChange={(e) =>
                        updateModel('timeout', Number(e.target.value) || null)
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
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
