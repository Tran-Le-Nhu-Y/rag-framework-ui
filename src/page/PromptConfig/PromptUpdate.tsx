import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';

export default function PromptUpdateDialog({
  open,
  promptName = '',
  promptDescription = '',
  promptContent = '',
  onCancel,
  onConfirm,
}: {
  open: boolean;
  promptName?: string;
  promptDescription?: string;
  promptContent?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState({
    name: promptName,
    description: promptDescription,
    content: promptContent,
  });

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('updatePrompt')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack justifyContent={'center'} alignItems="center">
            <Stack spacing={2} width="80%">
              <Stack spacing={1}>
                <TextField
                  size="small"
                  helperText={t('hyperTextMedium')}
                  label={t('promptName')}
                  value={prompt.name}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (isValidLength(newValue, TextLength.MEDIUM))
                      setPrompt((pre) => ({ ...pre, name: newValue }));
                  }}
                  placeholder={`${t('enter')} ${t(
                    'promptName'
                  ).toLowerCase()}...`}
                />

                <TextField
                  type="text"
                  placeholder={`${t('enter')} ${t(
                    'promptDescription'
                  ).toLowerCase()}...`}
                  label={t('promptDescription')}
                  value={prompt.description}
                  helperText={t('hyperTextVeryLong')}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (isValidLength(newValue, TextLength.MEDIUM))
                      setPrompt((pre) => ({ ...pre, description: newValue }));
                  }}
                  multiline
                  rows={2}
                />
                <TextField
                  type="text"
                  placeholder={`${t('enter')} ${t(
                    'promptContent'
                  ).toLowerCase()}...`}
                  label={t('promptContent')}
                  value={prompt.content}
                  helperText={t('hyperTextVeryLong')}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (isValidLength(newValue, TextLength.EXTREME_LONG))
                      setPrompt((pre) => ({ ...pre, content: newValue }));
                  }}
                  multiline
                  rows={10}
                />
              </Stack>

              <Box display="flex" justifyContent="center" gap={2}>
                <Button variant="contained" color="primary" onClick={onConfirm}>
                  {t('confirm')}
                </Button>
                <Button variant="outlined" color="info" onClick={onCancel}>
                  {t('cancel')}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
