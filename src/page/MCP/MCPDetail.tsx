import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { MCPStreamableServer } from '../../@types/entities';

export default function MCPDetailDialog({
  open,
  mcp,
  onExit,
}: {
  open: boolean;
  mcp: MCPStreamableServer | null;
  onExit: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onExit} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4">{t('promptDetailInformation')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack
          justifyContent={'center'}
          alignItems="center"
          spacing={2}
          sx={{ mt: 1, mb: 1 }}
        >
          <Stack spacing={2} width="100%">
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('mcpName')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {mcp?.name || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('mcpType')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {mcp?.type || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('url')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {mcp?.url || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('sse_read_timeout')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {mcp?.sse_read_timeout || 'N/A'}
              </Typography>
            </Stack>

            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('terminate_on_close')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {mcp?.terminate_on_close === true
                  ? t('true')
                  : mcp?.terminate_on_close === false
                  ? t('false')
                  : 'N/A'}
              </Typography>
            </Stack>

            <Stack direction={'row'} spacing={1}>
              <Typography variant="body1" fontWeight={'bold'}>
                {t('timeout')}:
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {mcp?.timeout || 'N/A'}
              </Typography>
            </Stack>

            <Typography variant="body1" fontWeight={'bold'}>
              {t('headers')}:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {mcp?.headers &&
                Object.entries(mcp.headers).map(([key, value]) => (
                  <Box
                    key={key}
                    display="flex"
                    alignItems="flex-start"
                    gap={1}
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      • {key} :
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
            </Box>

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" color="info" onClick={onExit}>
                {t('exit')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
