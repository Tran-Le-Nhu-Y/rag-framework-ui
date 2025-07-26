import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface SearchToolForm {
  name: string;
  type: string;
  max_results: number;
}

const TOOL_TYPES = ['Google', 'InternalDB', 'ElasticSearch'];

export default function SearchToolCreateDialog({
  open,
  onExit,
  onCreate,
}: {
  open: boolean;
  onExit: () => void;
  onCreate: (tool: SearchToolForm) => void;
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState<SearchToolForm>({
    name: '',
    type: '',
    max_results: 0,
  });

  const handleChange = (
    field: keyof SearchToolForm,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onCreate(form);
    setForm({ name: '', type: '', max_results: 0 });
    onExit();
  };

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('createSearchTool')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <TextField
            size="small"
            label={t('searchToolName')}
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
          />
          <TextField
            select
            size="small"
            label={t('searchingType')}
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
            fullWidth
          >
            {TOOL_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label={t('maxResults')}
            type="number"
            value={form.max_results}
            onChange={(e) =>
              handleChange('max_results', Number(e.target.value))
            }
            fullWidth
          />
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" onClick={handleSubmit}>
              {t('confirm')}
            </Button>
            <Button variant="outlined" onClick={onExit}>
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
