declare interface PagingWrapper<T> {
  content: Array<T>;
  first?: boolean;
  last?: boolean;
  page_number: number;
  page_size: number;
  total_elements: number;
  total_pages?: number;
}

declare interface PromptResponse {
  id: string;
  name: string;
  respond_prompt: string;
}

declare interface ChatModelResponse {
  id: string;
  model_name: string;
  provider: string;
  temperature: number;
  top_k?: number | null;
  top_p?: number | null;
  type: ChatModelType;
  base_url?: string | null;
  seed?: number | null;
  num_ctx: number;
  num_predict?: number | null;
  repeat_penalty?: number | null;
  stop?: string[] | null;
  max_tokens?: number | null;
  max_retries?: number | null;
  timeout?: number | null;
  safety_settings?: Record<string, string> | null;
}

declare interface EmbeddingsResponse {
  id: string;
  name: string;
  model_name: string;
  type: EmbeddingType;
  task_type?: GoogleGenAIEmbeddingsTaskType;
}

declare interface MCPStreamableServerResponse {
  id: string;
  name: string;
  url: string;
  type: MCPStreamType;
  headers?: Record<string, string> | null;
  timeout?: number;
  sse_read_timeout?: number;
  terminate_on_close?: boolean;
}

declare interface ChromaRetrieverResponse {
  id: string;
  name: string;
  weight: number;
  mode?: string;
  connection?: VectorStoreConnection | null;
  collection_name?: string;
  k?: number;
  tenant: string;
  database: string;
  type?: string;
  embeddings_id: string;
}

declare interface BM25RetrieverResponse {
  id: string;
  name: string;
  weight: number;
  k?: number;
  enable_remove_emoji?: boolean;
  enable_remove_emoticon?: boolean;
  type?: string;
  embeddings_id: string;
  removal_words_file_id?: string | null;
}

declare interface FileResponse {
  id: string;
  name: string;
  mime_type?: string | null;
  created_at: string;
}

declare interface ToolResponse {
  id: string;
  name: string;
  type: string;
  max_results: number;
}

declare interface ImageRecognizerResponse {
  id: string;
  name: string;
  type: string;
  model_file_id: string;
  min_probability: number;
  max_results?: number;
  output_classes: OutputClass[];
  preprocessing_configs: PreprocessingConfig[] | null;
}
