import { Stack, Typography, Box } from '@mui/material';
import { t } from 'i18next';

interface GoogleGenAIDetailProps {
  chatModel: GoogleGenAIChatModel;
}

const GoogleGenAIDetail = ({ chatModel }: GoogleGenAIDetailProps) => {
  return (
    <Stack width="100%">
      <Stack
        direction={'row'}
        spacing={2}
        width="100%"
        useFlexGap
        sx={{ flexWrap: 'wrap' }}
      >
        <Stack direction={'row'} spacing={1}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('topK')}:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {chatModel.topK || 'N/A'}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('temperature')}:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {chatModel.temperature || 'N/A'}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('topP')}:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {chatModel.topP || 'N/A'}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('maxTokens')}:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {chatModel.maxTokens || 'N/A'}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('maxRetries')}:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {chatModel.maxRetries || 'N/A'}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('timeout')}:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {chatModel.timeout || 'N/A'}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="body1" fontWeight={'bold'}>
        {t('safetySettings')}:
      </Typography>
      <Box sx={{ pl: 2 }}>
        {chatModel.safetySettings &&
          Object.entries(chatModel.safetySettings).map(([key, value]) => (
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
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {value}
              </Typography>
            </Box>
          ))}
      </Box>
    </Stack>
  );
};

export default GoogleGenAIDetail;
