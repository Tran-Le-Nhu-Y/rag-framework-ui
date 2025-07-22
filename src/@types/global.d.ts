declare type ChatModelType = 'google_genai' | 'ollama';
declare type EmbeddingType = 'google_genai' | 'hugging_face';
declare type RetrieverType = 'bm25' | 'chroma_db';

// Google GenAI
declare type HarmCategory =
  | 'UNSPECIFIED'
  | 'DEROGATORY'
  | 'TOXICITY'
  | 'VIOLENCE'
  | 'SEXUAL'
  | 'MEDICAL'
  | 'DANGEROUS'
  | 'HARASSMENT'
  | 'HATE_SPEECH'
  | 'SEXUALLY_EXPLICIT'
  | 'DANGEROUS_CONTENT'
  | 'CIVIC_INTEGRITY';

declare type HarmBlockThreshold =
  | 'UNSPECIFIED'
  | 'BLOCK_LOW_AND_ABOVE'
  | 'BLOCK_MEDIUM_AND_ABOVE'
  | 'BLOCK_ONLY_HIGH'
  | 'BLOCK_NONE'
  | 'OFF';

declare type GoogleGenAIEmbeddingsTaskType =
  | 'task_type_unspecified'
  | 'retrieval_query'
  | 'retrieval_document'
  | 'semantic_similarity'
  | 'classification'
  | 'clustering';
