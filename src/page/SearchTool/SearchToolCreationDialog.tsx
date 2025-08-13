import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { Tool } from '../../@types/entities';

const TOOL_TYPES = ['duckduckgo_search'];

export default function SearchToolCreateDialog({
  open,
  onExit,
  onCreate,
}: {
  open: boolean;
  onExit: () => void;
  onCreate: (tool: Tool) => void;
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState<Tool>({
    id: '',
    name: '',
    type: 'duckduckgo_search',
    max_results: 4,
  });

  const handleChange = (field: keyof Tool, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onCreate(form);
    setForm({ id: '', name: '', type: 'duckduckgo_search', max_results: 4 });
  };

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle variant="h4" sx={{ textAlign: 'center' }}>
        {t('createSearchTool')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <TextField
            required
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
          <Tooltip title={t('searchToolMaxResultsTooltip')}>
            <TextField
              size="small"
              label={t('maxResults')}
              type="number"
              value={form.max_results}
              inputProps={{
                min: 1,
                step: 1,
              }}
              onChange={(e) =>
                handleChange('max_results', Number(e.target.value))
              }
              fullWidth
            />
          </Tooltip>

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
