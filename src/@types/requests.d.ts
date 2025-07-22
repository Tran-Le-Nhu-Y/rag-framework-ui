declare interface CreatePromptRequest {
  suggestQuestionsPrompt: string;
  respondPrompt: string;
}

declare interface UpdatePromptRequest {
  promptId: string;
  suggestQuestionsPrompt: string;
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

declare interface CreateMCPRequest {
  servers: Array<MCPStreamableServer>;
}

declare interface UpdateMCPRequest {
  id: string;
  servers: Array<MCPStreamableServer>;
}
