declare interface CreatePromptRequest {
  promptName: string;
  respondPrompt: string;
}

declare interface UpdatePromptRequest {
  promptId: string;
  promptName: string;
  respondPrompt: string;
}

declare interface CreateChatModelRequest {
  name: string;
  model_name: string;
  provider: string;
  temperature: number;
  top_k?: number | null;
  top_p?: number | null;
  type: ChatModelType;
  // ollama
  base_url?: string | null;
  seed?: number | null;
  num_ctx?: number;
  num_predict?: number | null;
  repeat_penalty?: number | null;
  stop?: string[] | null;
  //google_genai
  max_tokens?: number;
  max_retries?: number;
  timeout?: number | null;
  safety_settings?: Record<string, string> | null;
}
declare interface UpdateChatModelRequest extends CreateChatModelRequest {
  chatModelId: string;
}

declare interface CreateEmbeddingRequest {
  id: string;
  name: string;
  model_name: string;
  task_type?: GoogleGenAIEmbeddingsTaskType;
  type: EmbeddingType;
}

declare interface UpdateEmbeddingRequest {
  id: string;
  name: string;
  model_name: string;
  task_type?: GoogleGenAIEmbeddingsTaskType;
  type: EmbeddingType;
}

declare interface CreateMCPStreamableServerRequest {
  name: string; // minLength: 1
  url: string;
  type: MCPStreamType; // default: 'streamable_http'
  headers?: Record<string, string> | null;
  timeout?: number; // default: 30
  sse_read_timeout?: number; // default: 300
  terminate_on_close?: boolean; // default: true
}

declare interface UpdateMCPStreamableServerRequest {
  id: string;
  name: string;
  url: string;
  type: MCPStreamType;
  headers?: Record<string, string> | null;
  timeout?: number;
  sse_read_timeout?: number;
  terminate_on_close?: boolean;
}

declare interface CreateChromaRetrieverRequest {
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

declare interface UpdateChromaRetrieverRequest {
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

declare interface CreateBM25RetrieverRequest {
  name: string;
  weight: number;
  k?: number;
  enable_remove_emoji?: boolean;
  enable_remove_emoticon?: boolean;
  type?: string;
  embeddings_id: string;
  removal_words_file_id?: string | null;
}

declare interface UpdateBM25RetrieverRequest {
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
declare interface UploadFileRequest {
  file: File;
}
declare interface UpdateBM25FileOnlyRequest {
  id: string;
  removal_words_file_id: string;
}

declare interface CreateToolRequest {
  name: string;
  type: string;
  max_results: number;
}

declare interface UpdateToolRequest {
  id: string;
  name: string;
  type: string;
  max_results: number;
}

declare interface CreateImageRecognizerRequest {
  name: string;
  type: string;
  model_file_id: string;
  min_probability: number;
  max_results?: number;
  output_classes: OutputClass[];
  preprocessing_configs: PreprocessingConfig[] | null;
}

declare interface UpdateImageRecognizerRequest {
  id: string;
  name: string;
  type: string;
  model_file_id: string;
  min_probability: number;
  max_results?: number;
  output_classes: OutputClass[];
  preprocessing_configs: PreprocessingConfig[] | null;
}

declare interface CreateAgentRequest {
  name: string; // [1, 100] characters
  description?: string | null;
  language: string;
  image_recognizer_id: string | null; // required, ≥ 1 character
  retriever_ids: string[] | null; // required, ≥ 1 item
  tool_ids?: string[] | null;
  mcp_server_ids?: string[] | null;
  llm_id: string;
  prompt_id: string;
}

declare interface UpdateAgentRequest {
  id: string;
  name: string; // [1, 100] characters
  description?: string | null;
  language: string;
  image_recognizer_id: string | null; // required, ≥ 1 character
  retriever_ids: string[] | null; // required, ≥ 1 item
  tool_ids?: string[] | null;
  mcp_server_ids?: string[] | null;
  llm_id: string;
  prompt_id: string;
}
