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

export default function TrainingDataCreationDialog({
  open,
  trainingDataName = '',
  trainingDataDescription = '',
  onFilesChange,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  trainingDataName?: string;
  trainingDataDescription?: string;
  onFilesChange: () => void;
  onConfirm: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(trainingDataName);
  const [description, setDescription] = useState(trainingDataDescription);

  useEffect(() => {
    setName(trainingDataName);
    setDescription(trainingDataDescription);
  }, [trainingDataName, trainingDataDescription]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('createTrainingData')}</Typography>
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
              label={t('trainingDataName')}
              value={name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setName(newValue);
              }}
              placeholder={`${t('enter')} ${t(
                'trainingDataName'
              ).toLowerCase()}...`}
            />

            <TextField
              type="text"
              placeholder={`${t('enter')} ${t(
                'trainingDataDescription'
              ).toLowerCase()}...`}
              label={t('trainingDataDescription')}
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
            <Typography variant="body1">{t('addTrainingDataFile')}:</Typography>
            <DragAndDropForm
              onFilesChange={onFilesChange}
              acceptedFileTypes={[
                'text/plain',
                'application/json',
                '.csv',
                'application/pdf',
              ]}
            />
            <Box display="flex" justifyContent="center">
              <Typography variant="body2" color="error">
                {t('justTextDataFile')}
              </Typography>
            </Box>

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
