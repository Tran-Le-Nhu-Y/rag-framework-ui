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
