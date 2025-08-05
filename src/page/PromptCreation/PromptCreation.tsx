import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  HideDuration,
  isValidLength,
  RoutePaths,
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
  const [name, setName] = useState('');
  const [respond, setRespond] = useState('');
  const [createPromptTrigger, createPrompt] = useCreatePrompt();
  const handleCreatePromptSubmit = async () => {
    if (name.trim().length === 0) {
      setSnackbarMessage(t('promptNameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (respond.trim().length === 0) {
      setSnackbarMessage(t('respondPromptRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    try {
      const newPrompt: CreatePromptRequest = {
        promptName: name,
        respondPrompt: respond,
      };

      await createPromptTrigger(newPrompt);
      setName('');
      setRespond('');
      navigate(RoutePaths.PROMPT);

      setSnackbarMessage(t('createPromptSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Creating prompt have error:', error);
      setSnackbarMessage(t('createPromptError'));
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
        {t('createPrompt')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="80%">
          <Stack spacing={2}>
            <TextField
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('promptName')}
              value={name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setName(newValue);
              }}
              placeholder={`${t('enter')} ${t('promptName').toLowerCase()}...`}
            />

            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'respond_prompt'
              ).toLowerCase()}...`}
              label={t('respond_prompt')}
              value={respond}
              onChange={(e) => setRespond(e.target.value)}
              multiline
              rows={15}
            />
          </Stack>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCreatePromptSubmit()}
              loading={createPrompt.isLoading}
              disabled={createPrompt.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.PROMPT)}
              disabled={createPrompt.isSuccess || createPrompt.isLoading}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
