import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface KeyValue {
  key: string;
  value: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (host: string, port: string, fields: KeyValue[]) => void;
  initialData?: {
    host: string;
    port: string;
    fields: KeyValue[];
  };
}

export default function RemoteConnectionDialog({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const { t } = useTranslation();
  const [host, setHost] = useState(initialData?.host || '');
  const [port, setPort] = useState(initialData?.port || '');
  const [fields, setFields] = useState<KeyValue[]>(
    initialData?.fields || [{ key: '', value: '' }]
  );

  const handleFieldChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setFields((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addField = () => {
    setFields((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(host, port, fields);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('remoteConnectionInfo')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <TextField
            label="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
          {fields.map((item, index) => (
            <Stack direction="row" spacing={1} key={index}>
              <TextField
                label="Key"
                value={item.key}
                onChange={(e) =>
                  handleFieldChange(index, 'key', e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Value"
                value={item.value}
                onChange={(e) =>
                  handleFieldChange(index, 'value', e.target.value)
                }
                fullWidth
              />
              <IconButton onClick={() => removeField(index)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Stack>
          ))}
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Button variant="contained" onClick={addField}>
              <Tooltip title={t('addField')}>
                <AddIcon />
              </Tooltip>
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
