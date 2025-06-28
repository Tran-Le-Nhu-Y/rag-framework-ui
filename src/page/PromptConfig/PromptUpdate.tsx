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
import { SelectForm } from '../../component';

export default function PromptUpdateDialog({
  open,
  agentName = '',
  agentDescription = '',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  agentName?: string;
  agentDescription?: string;
  onFilesChange: () => void;
  onConfirm: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(agentName);
  const [description, setDescription] = useState(agentDescription);

  useEffect(() => {
    setName(agentName);
    setDescription(agentDescription);
  }, [agentName, agentDescription]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('updateAgent')}</Typography>
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
              label={t('agentName')}
              value={name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setName(newValue);
              }}
              placeholder={`${t('enter')} ${t('agentName').toLowerCase()}...`}
            />

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
              rows={5}
            />
            <Typography variant="body1">{t('recognitionModel')}:</Typography>
            <SelectForm label={t('selectRecognitionModel')} dataList={[]} />

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={onConfirm.bind(null, { name, description })}
              >
                {t('save')}
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
