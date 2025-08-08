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
import { useGetMCPById, useUpdateMCP } from '../../service';
import { AppSnackbar, Loading, SelectForm } from '../../component';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { MCPStreamableServer, MCPStreamType } from '../../@types/entities';
import type { Data } from '../../component/SelectForm';

const typeList: Data[] = [
  { label: 'Streamable HTTP', value: 'streamable_http' },
  { label: 'Stdio', value: 'stdio' },
];

export default function MCPUpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mcpId = useParams()[PathHolders.MCP_ID];
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
      terminate_on_close: false,
    }
  );

  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

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

  //get mcp
  const mcp = useGetMCPById(mcpId!, { skip: !mcpId });
  useEffect(() => {
    if (mcp.data) {
      setStreamableServer(mcp.data);
      const headersArray = Object.entries(mcp.data.headers || {}).map(
        ([key, value]) => ({ key, value: String(value) })
      );
      setHeaders(headersArray.length ? headersArray : [{ key: '', value: '' }]);
    }
    if (mcp.isError) {
      setSnackbarMessage(t('mcpLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [mcp.data, mcp.isError, t]);

  const [updateMCPTrigger, updateMCP] = useUpdateMCP();
  const handleUpdateMCPSubmit = async () => {
    // Basic validation
    if (!streamableServer.name.trim()) {
      setSnackbarMessage(t('mcpName') + ' ' + t('cannotBeEmpty'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }

    if (!streamableServer.url.trim()) {
      setSnackbarMessage(t('url') + ' ' + t('cannotBeEmpty'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }

    if (!streamableServer.type) {
      setSnackbarMessage(t('selectMcpType') + ' ' + t('cannotBeEmpty'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }

    //  headers => object
    const headerObject = headers.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Prepare data
    const updatePayload: UpdateMCPStreamableServerRequest = {
      ...streamableServer,
      headers: headerObject,
    };

    try {
      await updateMCPTrigger(updatePayload).unwrap();

      setSnackbarMessage(t('updateMCPSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.MCP);
      }, 500);
    } catch (error) {
      setSnackbarMessage(t('updateMCPFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      console.log(error);
    }
  };
  if (mcp.isLoading) return <Loading />;

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
        {t('updateMCP')}
      </Typography>

      <Stack justifyContent={'center'} alignItems="center">
        <Stack spacing={2} width="80%">
          <Stack spacing={2} direction={'row'} width={'100%'}>
            <TextField
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
              onClick={() => handleUpdateMCPSubmit()}
              loading={updateMCP.isLoading}
              disabled={updateMCP.isSuccess}
            >
              {t('confirm')}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(RoutePaths.MCP)}
              disabled={updateMCP.isSuccess || updateMCP.isLoading}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
