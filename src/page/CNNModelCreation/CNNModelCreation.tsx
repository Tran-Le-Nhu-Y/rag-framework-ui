import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../../util';
import { InputFileUpload, SelectForm } from '../../component';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ConfigFileHelpDialog from './ConfigFileHelpDialog';
import type { Data } from '../../component/SelectForm';

type DynamicField = {
  className: string;
  classDescription: string;
};
// type PreprocessingType = 'ImageResize' | 'ImagePad' | 'ImageGrayscale';

type ImageResizeConfig = {
  type: 'resize';
  targetsize: string;
  interpolation: string;
  maxsize: string;
};

type ImagePadConfig = {
  type: 'pad';
  padding: string;
  fill: string;
  mode: string;
};

type ImageGrayscaleConfig = {
  type: 'grayscale';
  num_output_channels: string;
};
type PreprocessingConfig =
  | ImageResizeConfig
  | ImagePadConfig
  | ImageGrayscaleConfig;

export default function CNNModelCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [minProbability, setMinProbability] = useState('');
  const [maxResults, setMaxResults] = useState('');
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [preprocessingConfigs, setPreprocessingConfigs] = useState<
    PreprocessingConfig[]
  >([]);

  const preprocessingTypes: Data[] = [
    { label: 'ImageResize', value: 'resize' },
    { label: 'ImagePad', value: 'pad' },
    { label: 'ImageGrayscale', value: 'grayscale' },
  ];
  const imageResizeTypes: Data[] = [
    { label: 'Resize', value: 'resize' },
    { label: 'Pad', value: 'pad' },
    { label: 'Grayscale', value: 'grayscale' },
  ];
  const interpolationTypes: Data[] = [
    { label: 'Nearest', value: 'nearest' },
    { label: 'Nearest Exact', value: 'nearest-exact' },
    { label: 'Bilinear', value: 'bilinear' },
    { label: 'Bicubic', value: 'bicubic' },
  ];

  const modes: Data[] = [
    { label: 'constant', value: 'constant' },
    { label: 'edge', value: 'edge' },
    { label: 'reflect', value: 'reflect' },
    { label: 'symmetric', value: 'symmetric' },
  ];
  const availableTypes = preprocessingTypes.filter(
    (type) => !preprocessingConfigs.some((config) => config.type === type.value)
  );
  const handleAddPreprocessing = (selected: Data | null) => {
    if (!selected) return;

    const newConfig: PreprocessingConfig =
      selected.value === 'resize'
        ? {
            type: 'resize',
            targetsize: '',
            interpolation: '',
            maxsize: '',
          }
        : selected.value === 'pad'
        ? { type: 'pad', padding: '', fill: '', mode: '' }
        : { type: 'grayscale', num_output_channels: '' };

    setPreprocessingConfigs((prev) => [...prev, newConfig]);
    setOpenDialog(false);
  };

  const handleAddField = () => {
    setDynamicFields((prev) => [
      ...prev,
      { className: '', classDescription: '' },
    ]);
  };
  const handleRemoveField = (index: number) => {
    setDynamicFields((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFieldChange = (
    index: number,
    key: 'className' | 'classDescription',
    value: string
  ) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][key] = value;
    setDynamicFields(updatedFields);
  };

  const handleCancel = () => {
    navigate(-1);
  };
  const handleOpenHelpDialog = () => {
    setOpenHelpDialog(true);
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={1}>
      <Typography variant="h4">{t('createRecognitionModel')}</Typography>
      <Stack spacing={1} width="100%">
        <Stack direction={'row'} spacing={2} width="100%">
          <TextField
            fullWidth
            size="small"
            helperText={t('hyperTextMedium')}
            label={t('recognitionModelName')}
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.MEDIUM)) setName(newValue);
            }}
            placeholder={`${t('enter')} ${t(
              'recognitionModelName'
            ).toLowerCase()}...`}
          />
          <Stack direction={'row'} spacing={2} width="60%">
            <TextField
              fullWidth
              size="small"
              label={t('minProbability')}
              type="number"
              inputProps={{
                min: 0,
                max: 1,
                step: 0.1,
              }}
              value={minProbability}
              onChange={(e) => setMinProbability(e.target.value)}
              placeholder={`${t('enter')} ${t(
                'minProbability'
              ).toLowerCase()}...`}
            />
            <TextField
              fullWidth
              size="small"
              label={t('maxResults')}
              type="number"
              inputProps={{
                min: 1,
                max: 50,
                step: 1,
              }}
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
              placeholder={`${t('enter')} ${t('maxResults').toLowerCase()}...`}
            />
            <Stack>
              <Tooltip title={t('add_mageRecognitionModelConfigFile')}>
                <span>
                  <InputFileUpload
                    onFilesChange={() => {}}
                    acceptedFileTypes={['.pt', '.pth']}
                  />
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        <Stack pt={2}>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderColor: 'grey.400',
              borderRadius: 2,
              p: 3,
              position: 'relative',
            }}
          >
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              gap={2}
              sx={{
                position: 'absolute',
                top: 0,
                left: 12,
                transform: 'translateY(-50%)',
                backgroundColor: 'background.paper',
                px: 1,
              }}
            >
              <Typography variant="body1">
                <strong>{t('outputClassRecognitionModelDescription')}</strong>
                <IconButton color="primary" onClick={handleOpenHelpDialog}>
                  <HelpOutlineIcon />
                </IconButton>
                :
              </Typography>
              <InputFileUpload
                onFilesChange={() => {}}
                acceptedFileTypes={['.json']}
              />
            </Box>

            {dynamicFields.map((field, index) => (
              <Stack key={index} direction="row" spacing={2} pb={2}>
                <Stack direction={'row'} spacing={1} sx={{ width: '100%' }}>
                  <TextField
                    label={t('className')}
                    size="small"
                    value={field.className}
                    onChange={(e) =>
                      handleFieldChange(index, 'className', e.target.value)
                    }
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    label={t('classDescription')}
                    value={field.classDescription}
                    size="small"
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        'classDescription',
                        e.target.value
                      )
                    }
                    sx={{ width: '70%' }}
                  />
                </Stack>

                <IconButton
                  color="error"
                  aria-label="delete"
                  onClick={() => handleRemoveField(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}

            <Box display="flex" justifyContent="center">
              <Button variant="contained" onClick={handleAddField}>
                <Tooltip title={t('addDescription')}>
                  <AddCircleIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>
        </Stack>
        <Stack pb={2}>
          <Stack direction={'row'} alignItems={'center'}>
            <Typography variant="body1">
              <strong>{t('preprocessing_configs')}:</strong>
            </Typography>
            <IconButton onClick={() => setOpenDialog(true)}>
              <Tooltip title={t('add_preprocessing_configs')}>
                <AddCircleIcon color="primary" />
              </Tooltip>
            </IconButton>
          </Stack>
          <Stack spacing={1}>
            {preprocessingConfigs.map((config, index) => (
              <Box key={index}>
                <Typography variant="subtitle1">
                  {config.type === 'resize'
                    ? 'Image Resize'
                    : config.type === 'pad'
                    ? 'Image Pad'
                    : 'Image Grayscale'}
                  :
                </Typography>
                {config.type === 'resize' && (
                  <Stack spacing={1} direction={'row'} width={'100%'}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Target Size"
                      value={config.targetsize}
                      onChange={(e) => {
                        const updated = [...preprocessingConfigs];
                        (updated[index] as ImageResizeConfig).targetsize =
                          e.target.value;
                        setPreprocessingConfigs(updated);
                      }}
                    />
                    <SelectForm
                      label={t('Interpolation')}
                      dataList={interpolationTypes}
                      onChange={(val) => handleAddPreprocessing(val as Data)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Size"
                      value={config.maxsize}
                      onChange={(e) => {
                        const updated = [...preprocessingConfigs];
                        (updated[index] as ImageResizeConfig).maxsize =
                          e.target.value;
                        setPreprocessingConfigs(updated);
                      }}
                    />
                    <SelectForm
                      label={t('selectImageTypes')}
                      dataList={imageResizeTypes}
                      onChange={(val) => handleAddPreprocessing(val as Data)}
                    />
                  </Stack>
                )}

                {config.type === 'pad' && (
                  <Stack spacing={1} direction={'row'} width={'100%'}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Padding"
                      value={config.padding}
                      onChange={(e) => {
                        const updated = [...preprocessingConfigs];
                        (updated[index] as ImagePadConfig).padding =
                          e.target.value;
                        setPreprocessingConfigs(updated);
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Fill"
                      value={config.fill}
                      onChange={(e) => {
                        const updated = [...preprocessingConfigs];
                        (updated[index] as ImagePadConfig).fill =
                          e.target.value;
                        setPreprocessingConfigs(updated);
                      }}
                    />
                    <SelectForm
                      label={t('mode')}
                      dataList={modes}
                      onChange={(val) => handleAddPreprocessing(val as Data)}
                    />
                    <SelectForm
                      label={t('selectImageTypes')}
                      dataList={imageResizeTypes}
                      onChange={(val) => handleAddPreprocessing(val as Data)}
                    />
                  </Stack>
                )}

                {config.type === 'grayscale' && (
                  <Stack spacing={1} direction={'row'} width={'100%'}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Num Output Channels"
                      value={config.num_output_channels}
                      onChange={(e) => {
                        const updated = [...preprocessingConfigs];
                        (
                          updated[index] as ImageGrayscaleConfig
                        ).num_output_channels = e.target.value;
                        setPreprocessingConfigs(updated);
                      }}
                    />
                    <SelectForm
                      label={t('selectImageTypes')}
                      dataList={imageResizeTypes}
                      onChange={(val) => handleAddPreprocessing(val as Data)}
                    />
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={() => {}}>
            {t('confirm')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => handleCancel()}
          >
            {t('cancel')}
          </Button>
        </Box>
        <ConfigFileHelpDialog
          open={openHelpDialog}
          onClose={() => setOpenHelpDialog(false)}
        />
      </Stack>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('selectPreprocessingType')}</DialogTitle>
        <DialogContent>
          {availableTypes.length > 0 ? (
            <SelectForm
              dataList={availableTypes}
              onChange={(val) => handleAddPreprocessing(val as Data)}
            />
          ) : (
            <Typography>{t('noMorePreprocessingTypesAvailable')}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
