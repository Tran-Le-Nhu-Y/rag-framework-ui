import type {
  ImageRecognizer,
  ImageResize,
  ImagePad,
  ImageGrayscale,
  PreprocessingConfig,
} from '../../@types/entities';

function toEntity(response: ImageRecognizerResponse): ImageRecognizer {
  const preprocessingConfigs: PreprocessingConfig[] | null =
    response.preprocessing_configs
      ? response.preprocessing_configs
          .map((config) => {
            if (config.type === 'resize') {
              return {
                type: 'resize',
                target_size: config.target_size,
                interpolation: config.interpolation,
                max_size: config.max_size,
              } as ImageResize;
            } else if (config.type === 'pad') {
              return {
                type: 'pad',
                padding: config.padding,
                fill: config.fill,
                mode: config.mode,
              } as ImagePad;
            } else if (config.type === 'grayscale') {
              return {
                type: 'grayscale',
                num_output_channels: config.num_output_channels,
              } as ImageGrayscale;
            }
            return null;
          })
          .filter((c): c is PreprocessingConfig => c !== null)
      : null;

  const imageRecognizer: ImageRecognizer = {
    id: response.id,
    name: response.name,
    type: response.type,
    model_file_id: response.model_file_id,
    min_probability: response.min_probability,
    max_results: response.max_results,
    output_classes: response.output_classes,
    preprocessing_configs: preprocessingConfigs,
  };

  return imageRecognizer;
}

export { toEntity };
