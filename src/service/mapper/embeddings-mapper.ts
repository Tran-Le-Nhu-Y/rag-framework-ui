import type {
  Embeddings,
  HuggingFaceEmbeddings,
  GoogleGenAIEmbeddings,
} from '../../@types/entities';

function toEntity(response: EmbeddingsResponse): Embeddings {
  const baseEmbeddings = {
    id: response.id,
    name: response.name,
    model_name: response.model_name,
    type: response.type,
  };

  if (response.type === 'hugging_face') {
    const embeddingsModel: HuggingFaceEmbeddings = {
      ...baseEmbeddings,
      type: 'hugging_face',
    };
    return embeddingsModel;
  } else if (response.type === 'google_genai') {
    const embeddingsModel: GoogleGenAIEmbeddings = {
      ...baseEmbeddings,
      task_type: response.task_type ?? 'task_type_unspecified',
      type: 'google_genai',
    };
    return embeddingsModel;
  }

  throw new Error(`Unknown chat model type: ${response.type}`);
}

export { toEntity };
