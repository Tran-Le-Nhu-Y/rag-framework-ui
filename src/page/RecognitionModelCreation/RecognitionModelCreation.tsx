import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import { InputFileUpload, SelectForm } from '../../component';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type DynamicField = {
  className: string;
  classDescription: string;
};

export default function RecognitionModelCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const handleAddField = () => {
    setDynamicFields((prev) => [
      ...prev,
      { className: '', classDescription: '' },
    ]);
  };
  const handleRemoveField = (index: number) => {
    setDynamicFields((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFieldChange = (
    index: number,
    key: 'className' | 'classDescription',
    value: string
  ) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][key] = value;
    setDynamicFields(updatedFields);
  };

  const handleCancel = () => {
    navigate(-1);
  };
  const handleOpenHelpDialog = () => {
    setOpenHelpDialog(true);
  };

  const handleCloseHelpDialog = () => {
    setOpenHelpDialog(false);
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={1}>
      <Typography variant="h4">{t('createRecognitionModel')}</Typography>
      <Stack spacing={2} width="100%">
        <TextField
          fullWidth
          size="small"
          helperText={t('hyperTextMedium')}
          label={t('recognitionModelName')}
          value={name}
          onChange={(e) => {
            const newValue = e.target.value;
            if (isValidLength(newValue, TextLength.MEDIUM)) setName(newValue);
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
          rows={4}
        />

        <SelectForm label={t('selectModelType')} dataList={[]} />

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
          <Typography variant="body1">
            {t('imageRecognitionModelConfigFile')}:
          </Typography>
          <InputFileUpload
            onFilesChange={() => {}}
            acceptedFileTypes={['.pt', '.pth']}
          />
        </Box>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
          <Typography variant="body1">
            {t('outputClassRecognitionModelDescription')}:
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddField}>
            {t('addDescription')}
          </Button>
          <InputFileUpload
            onFilesChange={() => {}}
            acceptedFileTypes={['.json']}
          />
          <IconButton color="primary" onClick={handleOpenHelpDialog}>
            <HelpOutlineIcon />
          </IconButton>
        </Box>

        <Stack spacing={1} sx={{ width: '100%' }} mb={3}>
          {dynamicFields.map((field, index) => (
            <Stack key={index} direction="row" spacing={2}>
              <Stack direction={'row'} spacing={1} sx={{ width: '100%' }}>
                <TextField
                  label={t('className')}
                  size="small"
                  value={field.className}
                  onChange={(e) =>
                    handleFieldChange(index, 'className', e.target.value)
                  }
                  sx={{ width: '30%' }}
                />
                <TextField
                  label={t('classDescription')}
                  value={field.classDescription}
                  size="small"
                  onChange={(e) =>
                    handleFieldChange(index, 'classDescription', e.target.value)
                  }
                  sx={{ width: '70%' }}
                />
              </Stack>

              <IconButton
                color="error"
                aria-label="delete"
                onClick={() => handleRemoveField(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={() => {}}>
            {t('confirm')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => handleCancel()}
          >
            {t('cancel')}
          </Button>
        </Box>
        <Dialog
          open={openHelpDialog}
          onClose={handleCloseHelpDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {t('configFileInstructionTitle') || 'Hướng dẫn ghi file config'}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              {
                <>
                  Cấu trúc file <strong>config</strong> cần có định dạng sau:
                  <pre
                    style={{
                      background: '#f5f5f5',
                      padding: '10px',
                      marginTop: '10px',
                    }}
                  >
                    {`{
  "classes": [
    {
      "name": "Tên lớp 1",
      "description": "Mô tả lớp 1"
    },
    {
      "name": "Tên lớp 2",
      "description": "Mô tả lớp 2"
    }
  ]
}`}
                  </pre>
                  <Typography variant="body2" mt={2}>
                    🔹 <strong>"name"</strong>: Tên nhãn (label) của lớp mô hình
                    nhận diện.
                    <br />
                    🔹 <strong>"description"</strong>: Mô tả chi tiết về lớp đó,
                    ví dụ biểu hiện của bệnh hoặc đặc điểm nhận dạng.
                  </Typography>
                </>
              }
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseHelpDialog}>{t('close')}</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Stack>
  );
}
