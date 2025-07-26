import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import type { Data } from '../../component/SelectForm';
import { useNavigate } from 'react-router';
import SelectForm from '../../component/SelectForm';

export default function AgentUpdatePage() {
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

  return (
    <Stack spacing={1}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('updateAgent')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="100%">
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              fullWidth
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
              label={t('selectRetrievers')}
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
              label={t('selectSearching')}
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
