import {
  TextField,
  Stack,
  Tooltip,
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { t } from 'i18next';
import { SelectForm } from '../../component';
import type { Data } from '../../component/SelectForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useSnackbar } from '../../hook';

export interface GoogleGenAIChatModelAdditionalProperties {
  temperature: number;
  topK: number | null;
  topP: number | null;
  maxTokens: number;
  maxRetries: number;
  timeout: number | null;
  safetySettings: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }> | null;
}

const categories: HarmCategory[] = [
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

const thresholds: HarmBlockThreshold[] = [
  'BLOCK_LOW_AND_ABOVE',
  'BLOCK_MEDIUM_AND_ABOVE',
  'BLOCK_ONLY_HIGH',
  'BLOCK_NONE',
  'OFF',
];

const CreateGoogleGenAIProperties = ({
  value,
  onChange,
}: {
  value: GoogleGenAIChatModelAdditionalProperties;
  onChange: (props: GoogleGenAIChatModelAdditionalProperties) => void;
}) => {
  const { show: showSnackbar } = useSnackbar();
  const [availableCategories, setAvailableCategories] =
    useState<HarmCategory[]>(categories);

  const [safetySettingHolder, setSafetySettingHolder] = useState<{
    category?: HarmCategory;
    threshold?: HarmBlockThreshold;
  }>();

  return (
    <>
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
          value={value.topK ?? ''}
          onChange={(e) => {
            let topK: number | null = null;
            try {
              topK = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              topK = null;
            }
            onChange({ ...value, topK });
          }}
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
          value={value.topP ?? ''}
          onChange={(e) => {
            let topP: number | null = null;
            try {
              topP = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              topP = null;
            }
            onChange({ ...value, topP });
          }}
        />
      </Stack>

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
          value={value.temperature}
          onChange={(e) =>
            onChange({ ...value, temperature: Number(e.target.value) })
          }
        />
        <TextField
          fullWidth
          size="small"
          label={t('maxTokens')}
          type="number"
          inputProps={{ min: 10 }}
          value={value.maxTokens}
          onChange={(e) =>
            onChange({
              ...value,
              maxTokens: Math.max(10, Number(e.target.value)),
            })
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
          value={value.maxRetries}
          onChange={(e) =>
            onChange({
              ...value,
              maxRetries: Math.max(0, Number(e.target.value)),
            })
          }
        />
        <TextField
          fullWidth
          size="small"
          label={t('timeout')}
          type="number"
          value={value.timeout ?? ''}
          onChange={(e) => {
            let timeout: number | null = null;
            try {
              timeout = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              timeout = null;
            }
            onChange({ ...value, timeout });
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
          <strong>{t('safetySettings')}</strong>
        </Typography>

        <Stack direction={'column'} spacing={2}>
          <Stack direction={'row'} spacing={2}>
            <SelectForm
              label={t('category')}
              value={{
                value: safetySettingHolder?.category ?? '',
                label: safetySettingHolder?.category ?? '',
              }}
              dataList={availableCategories.map((opt) => ({
                label: opt,
                value: opt,
              }))}
              onChange={(selected) => {
                const selectedCategory = (selected as Data)
                  .value as HarmCategory;
                setSafetySettingHolder((pre) => ({
                  ...pre,
                  category: selectedCategory,
                }));
                setAvailableCategories(
                  availableCategories.filter((v) => v !== selectedCategory)
                );
              }}
            />
            <SelectForm
              label={t('level')}
              value={{
                value: safetySettingHolder?.threshold ?? '',
                label: safetySettingHolder?.threshold ?? '',
              }}
              dataList={thresholds.map((opt) => ({
                label: opt,
                value: opt,
              }))}
              onChange={(selected) => {
                const selectedThreshold = (selected as Data)
                  .value as HarmBlockThreshold;
                setSafetySettingHolder((pre) => ({
                  ...pre,
                  threshold: selectedThreshold,
                }));
              }}
            />

            <Tooltip title={t('addField')}>
              <IconButton
                size="medium"
                color="primary"
                disabled={
                  safetySettingHolder?.category === undefined ||
                  safetySettingHolder?.threshold === undefined
                }
                onClick={() => {
                  if (safetySettingHolder?.category === undefined) {
                    showSnackbar({
                      message: t('pleaseSelectHarmCategory'),
                      severity: 'warning',
                    });
                    return;
                  }
                  if (safetySettingHolder?.threshold === undefined) {
                    showSnackbar({
                      message: t('pleaseSelectHarmBlockThreshold'),
                      severity: 'warning',
                    });
                    return;
                  }

                  const { category, threshold } = safetySettingHolder;
                  const currentSettings = value.safetySettings ?? [];
                  onChange({
                    ...value,
                    safetySettings: [
                      ...currentSettings,
                      { category, threshold },
                    ],
                  });
                  setSafetySettingHolder(undefined);
                }}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {value.safetySettings?.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              alignItems="center"
              mb={2}
            >
              <Typography>{index + 1}.</Typography>
              <SelectForm
                readOnly={true}
                label={t('category')}
                dataList={availableCategories.map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                value={{ label: item.category, value: item.category }}
              />
              <SelectForm
                readOnly={true}
                label={t('level')}
                dataList={thresholds.map((level) => ({
                  label: level,
                  value: level,
                }))}
                value={{ label: item.threshold, value: item.threshold }}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  const currentSettings = value.safetySettings ?? [];
                  onChange({
                    ...value,
                    safetySettings: currentSettings.filter(
                      (v) => v.category !== item.category
                    ),
                  });
                }}
              >
                <DeleteIcon />
              </Button>
            </Stack>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default CreateGoogleGenAIProperties;
