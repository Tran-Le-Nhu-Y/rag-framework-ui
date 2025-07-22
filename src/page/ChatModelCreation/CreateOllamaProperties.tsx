import { TextField, Stack, Tooltip } from '@mui/material';
import { t } from 'i18next';

export interface OllamaChatModelAdditionalProperties {
  temperature: number;
  base_url: string;
  top_k: number | null;
  top_p: number | null;
  seed: number | null;
  num_ctx: number;
  num_predict: number | null;
  repeat_penalty: number | null;
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
          value={value.top_k ?? ''}
          onChange={(e) => {
            let topK: number | null = null;
            try {
              topK = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              topK = null;
            }
            onChange({ ...value, top_k: topK });
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
          value={value.top_p ?? ''}
          onChange={(e) => {
            let topP: number | null = null;
            try {
              topP = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              topP = null;
            }
            onChange({ ...value, top_p: topP });
          }}
        />
      </Stack>
      <TextField
        size="small"
        label={t('baseURL')}
        value={value.base_url}
        onChange={(e) => onChange({ ...value, base_url: e.target.value })}
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
          value={value.num_ctx}
          onChange={(e) =>
            onChange({ ...value, num_ctx: Number(e.target.value) })
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
          value={value.num_predict ?? ''}
          onChange={(e) => {
            let numPredict: number | null = null;
            try {
              numPredict = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              numPredict = null;
            }
            onChange({ ...value, num_predict: numPredict });
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
          value={value.repeat_penalty ?? ''}
          onChange={(e) => {
            let repeatPenalty: number | null = null;
            try {
              repeatPenalty = Number(e.target.value);
            } catch (error) {
              console.debug(error);
              repeatPenalty = null;
            }
            onChange({ ...value, repeat_penalty: repeatPenalty });
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
