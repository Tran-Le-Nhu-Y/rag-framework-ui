import { Stack, Typography } from '@mui/material';
import { t } from 'i18next';

interface OllamaDetailProps {
  chatModel: OllamaChatModel;
}

const OllamaDetail = ({ chatModel }: OllamaDetailProps) => {
  return (
    <Stack spacing={2} width="100%">
      <Stack direction={'row'} spacing={2} width="100%">
        <Stack spacing={2} width="100%">
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('numCtx')}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {chatModel.num_ctx || 'N/A'}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('repeatPenalty')}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {chatModel.repeat_penalty || 'N/A'}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} width="100%">
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('seed')}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {chatModel.seed || 'N/A'}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('numPredict')}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {chatModel.num_predict || 'N/A'}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Typography variant="body1" fontWeight={'bold'}>
          {t('baseURL')}:
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {chatModel.base_url || 'N/A'}
        </Typography>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Typography variant="body1" fontWeight={'bold'}>
          {t('stop')}:
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {chatModel.stop || 'N/A'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default OllamaDetail;
