import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  HideDuration,
  isValidLength,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useNavigate, useParams } from 'react-router';
import { AppSnackbar } from '../../component';
import { useGetPromptById, useUpdatePrompt } from '../../service';

export default function PromptUpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const promptId = useParams()[PathHolders.PROMPT_ID];
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [suggestQuestions, setSuggestQuestions] = useState('');
  const [respond, setRespond] = useState('');

  const prompt = useGetPromptById(promptId!, { skip: !promptId });
  useEffect(() => {
    if (prompt.isError) {
      setSnackbarMessage(t('promptLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [prompt.isError, t]);

  const [updatePromptTrigger] = useUpdatePrompt();
  useEffect(() => {
    if (prompt.data) {
      setSuggestQuestions(prompt.data.suggest_questions_prompt);
      setRespond(prompt.data.respond_prompt);
    }
  }, [prompt.data]);

  const handleSubmit = async (data: {
    suggestQuestionsPrompt: string;
    respondPrompt: string;
  }) => {
    if (!promptId) return;

    if (!data.suggestQuestionsPrompt.trim()) {
      setSnackbarMessage(t('suggestQuestionsPromptRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    } else if (!data.respondPrompt.trim()) {
      setSnackbarMessage(t('respondPromptRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    try {
      await updatePromptTrigger({
        promptId: promptId,
        suggestQuestionsPrompt: data.suggestQuestionsPrompt,
        respondPrompt: data.respondPrompt,
      });

      setSnackbarMessage(t('updatePromptSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.PROMPT);
      }, 1000);
    } catch (error) {
      setSnackbarMessage(t('updatePromptFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      console.error(error);
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
        {t('updatePrompt')}
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
              onClick={() =>
                handleSubmit({
                  suggestQuestionsPrompt: suggestQuestions,
                  respondPrompt: respond,
                })
              }
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
