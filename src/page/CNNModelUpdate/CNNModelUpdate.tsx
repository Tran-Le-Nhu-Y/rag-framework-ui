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
import { useEffect, useRef, useState } from 'react';
import {
  HideDuration,
  isValidLength,
  PathHolders,
  RoutePaths,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import {
  AppSnackbar,
  InputFileUpload,
  Loading,
  SelectForm,
} from '../../component';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { Data } from '../../component/SelectForm';
import {
  useDeleteFile,
  useGetFileById,
  useGetRecognizerById,
  usePostFile,
  useUpdateRecognizer,
} from '../../service';
import type {
  File as ServerFile,
  ImageGrayscale,
  ImagePad,
  ImageRecognizer,
  ImageResize,
  OutputClass,
} from '../../@types/entities';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ConfigFileHelpDialog from '../CNNModelCreation/ConfigFileHelpDialog';
import { FilePreviewCard } from '../../component/FilePreviewCard';

type PreprocessingConfig =
  | Partial<ImageResize>
  | Partial<ImagePad>
  | Partial<ImageGrayscale>;

const preprocessingTypes: Data[] = [
  { label: 'ImageResize', value: 'resize' },
  { label: 'ImagePad', value: 'pad' },
  { label: 'ImageGrayscale', value: 'grayscale' },
];

const interpolationTypes: Data[] = [
  { label: 'Nearest', value: 'nearest' },
  { label: 'Nearest Exact', value: 'nearest-exact' },
  { label: 'Bilinear', value: 'bilinear' },
  { label: 'Bicubic', value: 'bicubic' },
];

const modes: Data[] = [
  { label: 'Constant', value: 'constant' },
  { label: 'Edge', value: 'edge' },
  { label: 'Reflect', value: 'reflect' },
  { label: 'Symmetric', value: 'symmetric' },
];
const numOutputChannels = [
  { label: '1', value: '1' },
  { label: '3', value: '3' },
];

export default function CNNModelUpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const cnnModelId = useParams()[PathHolders.CNN_ID];
  const [selectedPreprocessingType, setSelectedPreprocessingType] =
    useState<Data | null>(null);
  const [outputClasses, setOutputClasses] = useState<OutputClass[]>([]);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [preprocessingConfigs, setPreprocessingConfigs] = useState<
    PreprocessingConfig[]
  >([]);
  const [newFile, setNewFile] = useState<File | null>(null); // New File => upload
  const [isRemoveOldFile, setIsRemoveOldFile] = useState(false); // remove file
  const [imageRecognizer, setImageRecognizer] = useState<ImageRecognizer>({
    id: '',
    name: '',
    type: 'image',
    model_file_id: '',
    min_probability: 0,
    max_results: 4,
    output_classes: [
      {
        name: '',
        description: '',
      },
    ],
    preprocessing_configs: [
      {
        type: 'resize',
        target_size: 0,
        interpolation: 'bilinear',
        max_size: 0,
      },
      {
        type: 'pad',
        padding: 0,
        fill: 0,
        mode: 'constant',
      },
      {
        type: 'grayscale',
        num_output_channels: 3,
      },
    ],
  });

  const availableTypes = preprocessingTypes.filter(
    (type) => !preprocessingConfigs.some((config) => config.type === type.value)
  );

  const handleAddField = () => {
    setOutputClasses((prev) => [...prev, { name: '', description: '' }]);
  };
  const handleRemoveField = (index: number) => {
    setOutputClasses((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFieldChange = (
    index: number,
    key: 'name' | 'description',
    value: string
  ) => {
    const updatedFields = [...outputClasses];
    const currentField = { ...updatedFields[index] }; //clone từng object
    currentField[key] = value;
    updatedFields[index] = currentField;
    setOutputClasses(updatedFields);
  };

  const handleOpenHelpDialog = () => {
    setOpenHelpDialog(true);
  };

  const updateFieldRecoginzer = (key: string, value: string) => {
    setImageRecognizer((prev) => ({ ...prev, [key]: value }));
  };

  //Get CNN Mode detail
  const recognizerDetail = useGetRecognizerById(cnnModelId!, {
    skip: !cnnModelId,
  });
  useEffect(() => {
    if (recognizerDetail.data) {
      const data = recognizerDetail.data;
      setImageRecognizer((prev) => ({
        ...prev,
        ...data,
      }));

      // Gán output_classes nếu tồn tại
      if (data.output_classes) {
        setOutputClasses(data.output_classes);
      }

      // Gán preprocessing_configs nếu tồn tại
      if (data.preprocessing_configs) {
        setPreprocessingConfigs(data.preprocessing_configs);
      }
    }
    if (recognizerDetail.isError) {
      setSnackbarMessage(t('cnnLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [recognizerDetail.data, recognizerDetail.isError, t]);

  //Get File Information
  const fileId = imageRecognizer?.model_file_id;
  const shouldFetchFile = !!fileId && fileId !== '';
  const fileDetail = useGetFileById(fileId!, {
    skip: !shouldFetchFile,
  });
  useEffect(() => {
    if (fileDetail.isError) {
      setSnackbarMessage(t('fileLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [fileDetail, fileDetail.isError, t]);
  // Thêm state để giữ file hiển thị
  const [fileData, setFileData] = useState<ServerFile | null>(null);
  // Thêm state để giữ file hiển thị
  useEffect(() => {
    if (fileDetail.data) setFileData(fileDetail.data);
  }, [fileDetail.data]);
  //old file id to delete
  const oldFileIdToDelete = fileDetail.data?.id;
  const oldFileIdToDeleteRef = useRef<string | null>(null);
  const [deleteFileTrigger] = useDeleteFile(); // delete old file
  const [postFile] = usePostFile();
  //Update CNN Model
  const [updateRecognizerTrigger, updateRecognizer] = useUpdateRecognizer();
  const handleUpdateSubmit = async () => {
    // Validate required fields
    if (!imageRecognizer.name.trim()) {
      setSnackbarMessage(t('cnnNameRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }

    if (!newFile && !imageRecognizer.model_file_id) {
      setSnackbarMessage(t('cnnModelRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    if (!outputClasses || outputClasses.length === 0) {
      setSnackbarMessage(t('outputClassRequired'));
      setSnackbarSeverity(SnackbarSeverity.WARNING);
      setSnackbarOpen(true);
      return;
    }
    for (let i = 0; i < outputClasses.length; i++) {
      const output = outputClasses[i];
      if (!output.name.trim()) {
        setSnackbarMessage(t('outputClassNameRequired'));
        setSnackbarSeverity(SnackbarSeverity.WARNING);
        setSnackbarOpen(true);
        return;
      }
      if (!output.description.trim()) {
        setSnackbarMessage(t('outputClassDescriptionRequired'));
        setSnackbarSeverity(SnackbarSeverity.WARNING);
        setSnackbarOpen(true);
        return;
      }
      if (output.description.trim().length < 10) {
        setSnackbarMessage(t('outputClassDescriptionTooShortRequired'));
        setSnackbarSeverity(SnackbarSeverity.WARNING);
        setSnackbarOpen(true);
        return;
      }
    }
    try {
      let updatedFileId = imageRecognizer.model_file_id;

      // Step 1: Delete old file (if any)
      if (isRemoveOldFile) {
        await deleteFileTrigger(oldFileIdToDelete!).unwrap();
        updatedFileId = '';
      }

      // Step 2: Upload new file (if any)
      if (newFile) {
        updatedFileId = await postFile({ file: newFile }).unwrap();
      }

      // Step 3: Update
      const payload: UpdateImageRecognizerRequest = {
        id: cnnModelId!,
        name: imageRecognizer.name,
        min_probability: imageRecognizer.min_probability,
        max_results: imageRecognizer.max_results,
        model_file_id: updatedFileId,
        type: imageRecognizer.type,
        output_classes: outputClasses,
        preprocessing_configs: preprocessingConfigs,
      };

      await updateRecognizerTrigger(payload);
      setSnackbarMessage(t('updateCNNSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(RoutePaths.CNN);
      }, 500);
      // Reset file state
      setNewFile(null);
      setIsRemoveOldFile(false);
      oldFileIdToDeleteRef.current = null;
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(t('updateCNNFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  };
  if (recognizerDetail.isLoading) return <Loading />;

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={1}>
      <Typography variant="h4">{t('updateRecognitionModel')}</Typography>
      <Stack spacing={1} width="100%">
        <Stack direction={'row'} spacing={1} width="100%" alignItems={'center'}>
          <TextField
            fullWidth
            size="small"
            //helperText={t('hyperTextMedium')}
            label={t('recognitionModelName')}
            value={imageRecognizer.name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.MEDIUM))
                updateFieldRecoginzer('name', newValue);
            }}
            placeholder={`${t('enter')} ${t(
              'recognitionModelName'
            ).toLowerCase()}...`}
          />
          <Stack direction={'row'} spacing={1} width="100%" alignItems="center">
            <Stack direction={'row'} spacing={1} width="55%">
              <Tooltip title={t('minProbabilityTooltip')} placement="top">
                <TextField
                  sx={{ width: '50%' }}
                  size="small"
                  label={t('minProbability')}
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 1,
                    step: 0.1,
                  }}
                  value={imageRecognizer.min_probability}
                  onChange={(e) =>
                    updateFieldRecoginzer('min_probability', e.target.value)
                  }
                  placeholder={`${t('enter')} ${t(
                    'minProbability'
                  ).toLowerCase()}...`}
                />
              </Tooltip>
              <Tooltip title={t('maxResultsTooltip')} placement="top">
                <TextField
                  sx={{ width: '50%' }}
                  size="small"
                  label={t('maxResults')}
                  type="number"
                  inputProps={{
                    min: 1,
                    max: 50,
                    step: 1,
                  }}
                  value={imageRecognizer.max_results}
                  onChange={(e) =>
                    updateFieldRecoginzer('max_results', e.target.value)
                  }
                  placeholder={`${t('enter')} ${t(
                    'maxResults'
                  ).toLowerCase()}...`}
                />
              </Tooltip>
            </Stack>

            <Stack
              direction={'row'}
              spacing={1}
              width="100%"
              alignItems="center"
            >
              <Typography variant="body1" fontWeight={'bold'}>
                {t('mageRecognitionModelConfigFile')}:
              </Typography>
              {fileDetail.isLoading ? (
                <Typography variant="body1">{t('loading')}</Typography>
              ) : fileData ? (
                <>
                  <FilePreviewCard
                    file={fileData}
                    onDelete={() => {
                      setIsRemoveOldFile(true);
                      setImageRecognizer((prev) => ({
                        ...prev,
                        model_file_id: '',
                      }));
                      setFileData(null); // Rerender UI
                    }}
                  />
                </>
              ) : (
                <Tooltip title={t('add_mageRecognitionModelConfigFile')}>
                  <span>
                    <InputFileUpload
                      onFilesChange={(files) => {
                        if (!files || files.length === 0) return;
                        setNewFile(files[0]);
                        setIsRemoveOldFile(true); // Khi chọn file mới thì đánh dấu xoá file cũ
                        setImageRecognizer((prev) => ({
                          ...prev,
                          model_file_id: '',
                        }));
                      }}
                      onFileRemove={() => {
                        setIsRemoveOldFile(true);
                        setNewFile(null);
                      }}
                      acceptedFileTypes={[]}
                    />
                  </span>
                </Tooltip>
              )}
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
                <Tooltip title={t('configFileInstructionTitle')}>
                  <IconButton color="primary" onClick={handleOpenHelpDialog}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                :
              </Typography>

              <label htmlFor="upload-output-class-file">
                <input
                  id="upload-output-class-file"
                  type="file"
                  accept=".json,.txt"
                  hidden
                  onChange={(event) => {
                    const files = event.target.files;
                    if (!files || files.length === 0) return;

                    const file = files[0];
                    const reader = new FileReader();

                    reader.onload = (event) => {
                      try {
                        const content = event.target?.result;
                        if (!content || typeof content !== 'string') return;

                        const parsed = JSON.parse(content);

                        // Validate format: must be an array of { name: string, description: string }
                        if (
                          Array.isArray(parsed) &&
                          parsed.every(
                            (item) =>
                              typeof item.name === 'string' &&
                              typeof item.description === 'string'
                          )
                        ) {
                          setOutputClasses((prev) => [...prev, ...parsed]);
                        } else {
                          setSnackbarMessage(t('invalidOutputClassFormat'));
                          setSnackbarSeverity(SnackbarSeverity.ERROR);
                          setSnackbarOpen(true);
                        }
                      } catch (error) {
                        console.log(error);
                        setSnackbarMessage(t('invalidFileFormat'));
                        setSnackbarSeverity(SnackbarSeverity.ERROR);
                        setSnackbarOpen(true);
                      }
                    };
                    // Reset lại input sau khi load
                    event.target.value = '';
                    reader.readAsText(file);
                  }}
                />
                <Tooltip title={t('uploadOutputClassFile')}>
                  <IconButton component="span">
                    <UploadFileIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </label>
            </Box>

            {outputClasses.map((field, index) => (
              <Stack key={index} direction="row" spacing={2} pb={2}>
                <Stack direction={'row'} spacing={1} sx={{ width: '100%' }}>
                  <Tooltip title={t('classNameTooltip')}>
                    <TextField
                      label={t('className')}
                      size="small"
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(index, 'name', e.target.value)
                      }
                      sx={{ width: '30%' }}
                    />
                  </Tooltip>
                  <Tooltip title={t('classDescriptionTooltip')}>
                    <TextField
                      label={t('classDescription')}
                      value={field.description}
                      size="small"
                      onChange={(e) =>
                        handleFieldChange(index, 'description', e.target.value)
                      }
                      sx={{ width: '70%' }}
                    />
                  </Tooltip>
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
          <Stack spacing={2}>
            {preprocessingConfigs.map((config, index) => (
              <Stack
                direction={'row'}
                key={index}
                width={'100%'}
                alignItems={'center'}
              >
                <Box display={'flex'} width={'15%'}>
                  <Typography variant="subtitle1">
                    {config.type === 'resize'
                      ? 'Image Resize'
                      : config.type === 'pad'
                      ? 'Image Pad'
                      : 'Image Grayscale'}
                  </Typography>
                </Box>

                {config.type === 'resize' && (
                  <Stack spacing={1} direction={'row'} width={'100%'}>
                    <Stack sx={{ width: '33%' }}>
                      <Tooltip title={t('targetSizeTooltip')}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          inputProps={{
                            min: 0,
                            step: 1,
                          }}
                          label={t('targetSize')}
                          value={config.target_size}
                          onChange={(e) => {
                            const updated = [...preprocessingConfigs];
                            (updated[index] as ImageResize).target_size =
                              Number(e.target.value);
                            setPreprocessingConfigs(updated);
                          }}
                        />
                      </Tooltip>
                    </Stack>

                    <Stack sx={{ width: '33%' }}>
                      <Tooltip title={t('InterpolationTooltip')}>
                        <span>
                          <SelectForm
                            label={t('Interpolation')}
                            dataList={interpolationTypes}
                            value={
                              interpolationTypes.find(
                                (item) => item.value === config.interpolation
                              ) || null
                            }
                            onChange={(val) => {
                              const updated = [...preprocessingConfigs];
                              (updated[index] as ImageResize).interpolation = (
                                val as Data
                              ).value;
                              setPreprocessingConfigs(updated);
                            }}
                          />
                        </span>
                      </Tooltip>
                    </Stack>

                    {/* <TextField
										  fullWidth
										  size="small"
										  type="number"
										  inputProps={{
											min: 0,
											step: 1,
										  }}
										  label="Max Size"
										  value={config.max_size}
										  onChange={(e) => {
											const updated = [...preprocessingConfigs];
											(updated[index] as ImageResize).max_size = Number(
											  e.target.value
											);
											setPreprocessingConfigs(updated);
										  }}
										/> */}
                  </Stack>
                )}

                {config.type === 'pad' && (
                  <Stack spacing={1} direction={'row'} width={'100%'}>
                    <Tooltip title={t('paddingTooltip')}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t('padding')}
                        value={config.padding}
                        onChange={(e) => {
                          const updated = [...preprocessingConfigs];
                          (updated[index] as ImagePad).padding = Number(
                            e.target.value
                          );
                          setPreprocessingConfigs(updated);
                        }}
                      />
                    </Tooltip>

                    <Tooltip title={t('fillTooltip')}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t('fill')}
                        value={config.fill}
                        onChange={(e) => {
                          const updated = [...preprocessingConfigs];
                          (updated[index] as ImagePad).fill = Number(
                            e.target.value
                          );
                          setPreprocessingConfigs(updated);
                        }}
                      />
                    </Tooltip>

                    <SelectForm
                      label={t('paddingMode')}
                      dataList={modes}
                      value={
                        modes.find((item) => item.value === config.mode) || null
                      }
                      onChange={(val) => {
                        const value = (val as Data).value;
                        const updated = [...preprocessingConfigs];
                        const current = {
                          ...(updated[index] as ImagePad),
                        };
                        current.mode = value;
                        updated[index] = current;
                        setPreprocessingConfigs(updated);
                      }}
                    />
                  </Stack>
                )}

                {config.type === 'grayscale' && (
                  <Stack spacing={1} direction={'row'} width={'100%'}>
                    <Box width={'33%'}>
                      <SelectForm
                        label={t('selectNumOutputChannels')}
                        dataList={numOutputChannels}
                        value={
                          numOutputChannels.find(
                            (item) =>
                              Number(item.value) === config.num_output_channels
                          ) || null
                        }
                        onChange={(val) => {
                          const value = Number((val as Data).value);
                          const updated = [...preprocessingConfigs];
                          const current = {
                            ...(updated[index] as ImageGrayscale),
                          };
                          current.num_output_channels = value;
                          updated[index] = current;
                          setPreprocessingConfigs(updated);
                        }}
                      />
                    </Box>
                  </Stack>
                )}
                <IconButton
                  color="error"
                  aria-label="delete-preprocessing"
                  onClick={() => {
                    setPreprocessingConfigs((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateSubmit}
            disabled={updateRecognizer.isSuccess}
            loading={updateRecognizer.isLoading}
          >
            {t('confirm')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => navigate(RoutePaths.CNN)}
            disabled={updateRecognizer.isSuccess || updateRecognizer.isLoading}
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
            <Stack spacing={2}>
              <SelectForm
                dataList={availableTypes}
                value={selectedPreprocessingType}
                onChange={(val) => setSelectedPreprocessingType(val as Data)}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (!selectedPreprocessingType) return;

                  const selected = selectedPreprocessingType.value;
                  const newConfig: PreprocessingConfig =
                    selected === 'resize'
                      ? {
                          type: 'resize',
                          target_size: 0,
                          interpolation: 'bilinear',
                          max_size: 0,
                        }
                      : selected === 'pad'
                      ? { type: 'pad', padding: 0, fill: 0, mode: 'constant' }
                      : { type: 'grayscale', num_output_channels: 3 };

                  setPreprocessingConfigs((prev) => [...prev, newConfig]);
                  setSelectedPreprocessingType(null);
                  setOpenDialog(false);
                }}
              >
                {t('confirm')}
              </Button>
            </Stack>
          ) : (
            <Typography>{t('noMorePreprocessingTypesAvailable')}</Typography>
          )}
        </DialogContent>
      </Dialog>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
    </Stack>
  );
}
