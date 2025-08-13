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
import { AppSnackbar, Loading } from '../../component';
import { useGetPromptById, useUpdatePrompt } from '../../service';

export default function PromptUpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const promptId = useParams()[PathHolders.PROMPT_ID];
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [name, setName] = useState('');
  const [respond, setRespond] = useState('');

  const prompt = useGetPromptById(promptId!, { skip: !promptId });
  useEffect(() => {
    if (prompt.data) {
      setName(prompt.data.name);
      setRespond(prompt.data.respond_prompt);
    }
    if (prompt.isError) {
      setSnackbarMessage(t('promptLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [prompt.data, prompt.isError, t]);

  const [updatePromptTrigger, updatePrompt] = useUpdatePrompt();
  const handleSubmit = async (data: {
    name: string;
    respondPrompt: string;
  }) => {
    if (!promptId) return;

    if (!data.name.trim()) {
      setSnackbarMessage(t('promptNameRequired'));
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
        promptName: data.name,
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

  if (prompt.isLoading) return <Loading />;
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
          <Stack spacing={2}>
            <TextField
              required
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
              required
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
              onClick={() =>
                handleSubmit({
                  name: name,
                  respondPrompt: respond,
                })
              }
              loading={updatePrompt.isLoading}
              disabled={updatePrompt.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.PROMPT)}
              disabled={updatePrompt.isSuccess || updatePrompt.isLoading}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
