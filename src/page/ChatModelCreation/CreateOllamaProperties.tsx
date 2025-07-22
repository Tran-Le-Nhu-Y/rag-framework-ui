import { TextField, Stack, Tooltip } from '@mui/material';
import { t } from 'i18next';

export interface OllamaChatModelAdditionalProperties {
  temperature: number;
  baseUrl: string;
  topK: number | null;
  topP: number | null;
  seed: number | null;
  numCtx: number;
  numPredict: number | null;
  repeatPenalty: number | null;
  stop: string;
}

const CreateOllamaProperties = ({
  value,
  onChange,
}: {
  value: OllamaChatModelAdditionalProperties;
  onChange: (props: OllamaChatModelAdditionalProperties) => void;
}) => {
  return (
    <>
      <Stack direction={'row'} spacing={2} width="100%">
        <TextField
          fullWidth
          size="small"
          label={t('topK')}
          type="number"
          inputProps={{
            min: 0,
            step: 1,
          }}
          value={value.topK ?? ''}
          onChange={(e) => {
            let topK: number | null = null;
            try {
              topK = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              topK = null;
            }
            onChange({ ...value, topK });
          }}
        />
        <TextField
          fullWidth
          size="small"
          label={t('topP') + ' [0-1]'}
          type="number"
          inputProps={{
            min: 0,
            max: 1,
            step: 0.1,
          }}
          value={value.topP ?? ''}
          onChange={(e) => {
            let topP: number | null = null;
            try {
              topP = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              topP = null;
            }
            onChange({ ...value, topP });
          }}
        />
      </Stack>
      <TextField
        size="small"
        label={t('baseURL')}
        value={value.baseUrl}
        onChange={(e) => onChange({ ...value, baseUrl: e.target.value })}
      />
      <Stack direction={'row'} spacing={2} width="100%">
        <TextField
          fullWidth
          size="small"
          label={t('temperature') + ' [0-1]'}
          type="number"
          inputProps={{
            min: 0,
            max: 1,
            step: 0.1,
          }}
          value={value.temperature}
          onChange={(e) =>
            onChange({ ...value, temperature: Number(e.target.value) })
          }
        />

        <TextField
          fullWidth
          size="small"
          label={t('seed')}
          type="number"
          value={value.seed ?? ''}
          onChange={(e) => {
            let seed: number | null = null;
            try {
              seed = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              seed = null;
            }
            onChange({ ...value, seed });
          }}
        />
      </Stack>
      <Stack direction={'row'} spacing={2} width="100%">
        <TextField
          fullWidth
          size="small"
          label={t('numCtx')}
          type="number"
          inputProps={{
            min: 0,
            step: 1,
          }}
          value={value.numCtx}
          onChange={(e) =>
            onChange({ ...value, numCtx: Number(e.target.value) })
          }
        />
        <TextField
          fullWidth
          size="small"
          label={t('numPredict')}
          type="number"
          inputProps={{
            min: 0,
            step: 1,
          }}
          value={value.numPredict ?? ''}
          onChange={(e) => {
            let numPredict: number | null = null;
            try {
              numPredict = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              numPredict = null;
            }
            onChange({ ...value, numPredict });
          }}
        />
      </Stack>
      <Stack direction={'row'} spacing={2} width="100%">
        <TextField
          fullWidth
          size="small"
          label={t('repeatPenalty') + ' [0-2]'}
          type="number"
          inputProps={{
            min: 0,
            max: 2,
            step: 0.1,
          }}
          value={value.repeatPenalty ?? ''}
          onChange={(e) => {
            let repeatPenalty: number | null = null;
            try {
              repeatPenalty = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              repeatPenalty = null;
            }
            onChange({ ...value, repeatPenalty });
          }}
        />
        <Tooltip title={t('ollamaStopTokenHint')}>
          <TextField
            fullWidth
            size="small"
            label={t('stop')}
            value={value.stop}
            onChange={(e) => onChange({ ...value, stop: e.target.value })}
          />
        </Tooltip>
      </Stack>
    </>
  );
};

export default CreateOllamaProperties;
