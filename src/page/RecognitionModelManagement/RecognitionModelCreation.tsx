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
import { useEffect, useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import { DragAndDropForm } from '../../component';

export default function RecognitionModelCreationDialog({
  open,
  recognitionModelName = '',
  recognitionModelDescription = '',
  onFilesChange,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  recognitionModelName?: string;
  recognitionModelDescription?: string;
  onFilesChange: () => void;
  onConfirm: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(recognitionModelName);
  const [description, setDescription] = useState(recognitionModelDescription);

  useEffect(() => {
    setName(recognitionModelName);
    setDescription(recognitionModelDescription);
  }, [recognitionModelName, recognitionModelDescription]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('createRecognitionModel')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack
          justifyContent={'center'}
          alignItems="center"
          spacing={2}
          sx={{ mt: 1, mb: 1 }}
        >
          <Stack spacing={2} width="100%">
            <TextField
              fullWidth
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('recognitionModelName')}
              value={name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setName(newValue);
              }}
              placeholder={`${t('enter')} ${t(
                'recognitionModelName'
              ).toLowerCase()}...`}
            />

            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'recognitionModelDescription'
              ).toLowerCase()}...`}
              label={t('recognitionModelDescription')}
              value={description}
              helperText={t('hyperTextVeryLong')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setDescription(newValue);
              }}
              multiline
              rows={5}
            />
            <Typography variant="body1">
              {t('recognitionModelConfigFile')}:
            </Typography>
            <DragAndDropForm
              onFilesChange={onFilesChange}
              acceptedFileTypes={[
                'text/plain',
                'application/json',
                '.csv',
                'application/pdf',
              ]}
            />

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={onConfirm.bind(null, { name, description })}
              >
                {t('confirm')}
              </Button>
              <Button variant="outlined" color="info" onClick={onCancel}>
                {t('cancel')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
