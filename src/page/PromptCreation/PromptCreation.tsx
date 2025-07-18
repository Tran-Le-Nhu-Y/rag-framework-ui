import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  HideDuration,
  isValidLength,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useNavigate } from 'react-router';
import { useCreatePrompt } from '../../service';
import { AppSnackbar } from '../../component';

export default function PromptCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [suggestQuestions, setSuggestQuestions] = useState('');
  const [respond, setRespond] = useState('');
  const [createPromptTrigger, createPrompt] = useCreatePrompt();
  useEffect(() => {
    if (createPrompt.isError) {
      setSnackbarMessage(t('createPromptError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    } else if (createPrompt.isSuccess) {
      setSnackbarMessage(t('createPromptSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      navigate('/prompt-management');
    }
  }, [createPrompt.isError, createPrompt.isSuccess, navigate, t]);

  const handleCreatePromptSubmit = async () => {
    try {
      const newPrompt: CreatePromptRequest = {
        suggestQuestionsPrompt: suggestQuestions,
        respondPrompt: respond,
      };
      console.log('Creating prompt:', newPrompt);

      const result = await createPromptTrigger(newPrompt).unwrap();
      console.log('Create result:', result);

      //   await createPromptTrigger(newPrompt);
      setSuggestQuestions('');
      setRespond('');
      navigate('/prompt-management');

      setSnackbarMessage(t('createPromptSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Creating prompt have error:', error);
      setSnackbarMessage(t('createPromptError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
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
              onClick={() => handleCreatePromptSubmit()}
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
