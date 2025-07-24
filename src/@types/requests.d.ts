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
