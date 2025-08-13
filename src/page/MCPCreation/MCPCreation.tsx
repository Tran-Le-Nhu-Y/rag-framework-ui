import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
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
import { useCreateMCP } from '../../service';
import { AppSnackbar, SelectForm } from '../../component';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { MCPStreamableServer, MCPStreamType } from '../../@types/entities';
import type { Data } from '../../component/SelectForm';

const typeList: Data[] = [
  { label: 'Streamable HTTP', value: 'streamable_http' },
];

export default function MCPCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [streamableServer, setStreamableServer] = useState<MCPStreamableServer>(
    {
      id: '',
      name: '',
      type: 'streamable_http',
      url: '',
      headers: {},
      timeout: 60,
      sse_read_timeout: 30,
      terminate_on_close: true,
    }
  );

  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

  // header =>  object
  const headerObject = headers.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const [createMCPTrigger, createMCP] = useCreateMCP();
  const handleCreateMCPSubmit = async () => {
    // Validate required fields
    if (!streamableServer.name.trim()) {
      setSnackbarMessage(t('mcpNameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (!streamableServer.url) {
      setSnackbarMessage(t('urlRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    try {
      const fullServerData: MCPStreamableServer = {
        ...streamableServer,
        headers: headerObject,
      };

      const newMCP: CreateMCPStreamableServerRequest = {
        name: fullServerData.name,
        type: fullServerData.type,
        url: fullServerData.url,
        headers: fullServerData.headers,
        sse_read_timeout: fullServerData.sse_read_timeout,
        terminate_on_close: fullServerData.terminate_on_close,
        timeout: fullServerData.timeout,
      };

      await createMCPTrigger(newMCP);
      setSnackbarMessage(t('createMCPSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      navigate(RoutePaths.MCP);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('createMCPFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleHeaderChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
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
      <Typography sx={{ textAlign: 'center' }} variant="h4" pb={2}>
        {t('createMCP')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="80%">
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <TextField
              required
              fullWidth
              size="small"
              helperText={t('hyperTextMedium')}
              label={t('mcpName')}
              value={streamableServer.name}
              onChange={(e) => {
                const newValue = e.target.value;
                if (isValidLength(newValue, TextLength.MEDIUM))
                  setStreamableServer((prev) => ({
                    ...prev,
                    name: newValue,
                  }));
              }}
              placeholder={`${t('enter')} ${t('mcpName').toLowerCase()}...`}
            />

            <SelectForm
              label={t('selectMcpType')}
              dataList={typeList}
              value={
                typeList.find((item) => item.value === streamableServer.type) ||
                null
              }
              isClearable={false}
              onChange={(selected) => {
                setStreamableServer((prev) => ({
                  ...prev,
                  type: (selected as Data).value as MCPStreamType,
                }));
              }}
            />
          </Stack>
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <Tooltip title={t('urlTooltip')} placement="top">
              <TextField
                required
                fullWidth
                size="small"
                helperText={t('hyperTextMedium')}
                label={t('url')}
                value={streamableServer.url}
                onChange={(e) =>
                  setStreamableServer((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                placeholder={`${t('enter')} ${t('url').toLowerCase()}...`}
              />
            </Tooltip>

            <Tooltip title={t('mcpTimeoutTooltip')} placement="top">
              <TextField
                fullWidth
                size="small"
                type="text"
                placeholder={`${t('enter')} ${t('timeout').toLowerCase()}...`}
                label={t('timeout')}
                value={streamableServer.timeout}
                onChange={(e) =>
                  setStreamableServer((prev) => ({
                    ...prev,
                    timeout: Number(e.target.value),
                  }))
                }
              />
            </Tooltip>
          </Stack>
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <Tooltip title={t('sse_read_timeout_Tooltip')} placement="top">
              <TextField
                fullWidth
                size="small"
                helperText={t('hyperTextMedium')}
                label={t('sse_read_timeout')}
                value={streamableServer.sse_read_timeout}
                onChange={(e) =>
                  setStreamableServer((prev) => ({
                    ...prev,
                    sse_read_timeout: Number(e.target.value),
                  }))
                }
                placeholder={`${t('enter')} ${t(
                  'sse_read_timeout'
                ).toLowerCase()}...`}
              />
            </Tooltip>

            <FormControlLabel
              sx={{ width: '100%' }}
              label={t('terminate_on_close')}
              control={
                <Switch
                  checked={streamableServer.terminate_on_close}
                  onChange={(e) =>
                    setStreamableServer((prev) => ({
                      ...prev,
                      terminate_on_close: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              }
            />
          </Stack>

          <Stack spacing={1} width={'100%'}>
            <Typography variant="subtitle1">{t('headers')}:</Typography>
            {headers.map((header, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="center"
                width={'100%'}
              >
                <TextField
                  size="small"
                  fullWidth
                  label={t('headerKey')}
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, 'key', e.target.value)
                  }
                  placeholder={`${t('enter')} ${t(
                    'headerKey'
                  ).toLowerCase()}...`}
                />
                <TextField
                  size="small"
                  fullWidth
                  label={t('headerValue')}
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, 'value', e.target.value)
                  }
                  placeholder={`${t('enter')} ${t(
                    'headerValue'
                  ).toLowerCase()}...`}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveHeader(index)}
                >
                  <DeleteIcon />
                </Button>
              </Stack>
            ))}

            <Box display="flex" justifyContent="center">
              <Button variant="contained" onClick={handleAddHeader}>
                <Tooltip title={t('addHeader')}>
                  <AddCircleIcon />
                </Tooltip>
              </Button>
            </Box>
          </Stack>

          <Box display="flex" justifyContent="center" gap={2} pt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCreateMCPSubmit()}
              loading={createMCP.isLoading}
              disabled={createMCP.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.MCP)}
              disabled={createMCP.isSuccess || createMCP.isLoading}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
