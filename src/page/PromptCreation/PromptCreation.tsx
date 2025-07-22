import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  isValidLength,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useNavigate } from 'react-router';
import { useCreatePrompt } from '../../service';
import { useSnackbar } from '../../hook';

export default function PromptCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const [suggestQuestions, setSuggestQuestions] = useState('');
  const [respond, setRespond] = useState('');

  const [createPromptTrigger, createPrompt] = useCreatePrompt();
  const handleCreatePromptSubmit = async () => {
    try {
      const newPrompt: CreatePromptRequest = {
        suggestQuestionsPrompt: suggestQuestions,
        respondPrompt: respond,
      };

      await createPromptTrigger(newPrompt).unwrap();
      setSuggestQuestions('');
      setRespond('');
      navigate(RoutePaths.PROMPT);

      showSnackbar({
        message: t('createPromptSuccess'),
        severity: SnackbarSeverity.SUCCESS,
      });
    } catch (error) {
      console.error('Creating prompt have error:', error);
      showSnackbar({
        message: t('createPromptError'),
        severity: SnackbarSeverity.ERROR,
      });
      return;
    }
  };

  return (
    <Stack spacing={1}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {t('createPrompt')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="80%">
          <Stack spacing={1}>
            <TextField
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('suggest_questions_prompt')}
              value={suggestQuestions}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setSuggestQuestions(newValue);
              }}
              placeholder={`${t('enter')} ${t(
                'suggest_questions_prompt'
              ).toLowerCase()}...`}
              multiline
              rows={5}
            />

            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'respond_prompt'
              ).toLowerCase()}...`}
              label={t('respond_prompt')}
              value={respond}
              helperText={t('hyperTextVeryLong')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.EXTREME_LONG))
                  setRespond(newValue);
              }}
              multiline
              rows={10}
            />
          </Stack>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              loading={createPrompt.isLoading}
              onClick={() => handleCreatePromptSubmit()}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              disabled={createPrompt.isLoading}
              onClick={() => navigate(RoutePaths.PROMPT)}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
