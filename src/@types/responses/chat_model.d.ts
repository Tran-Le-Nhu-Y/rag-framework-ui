declare type ChatModelResponse =
  | GoogleGenAIChatModelResponse
  | OllamaChatModelResponse;

declare interface BaseChatModelResponse {
  id: string;
  model_name: string;
  type: ChatModelType;
}

declare interface GoogleGenAIChatModelResponse extends BaseChatModelResponse {
  type: 'google_genai';
  temperature: number;
  top_k?: number | null;
  top_p?: number | null;
  stop?: string[] | null;
  max_tokens?: number | null;
  max_retries?: number | null;
  timeout?: number | null;
  safety_settings?: Record<HarmCategory, HarmBlockThreshold> | null;
}

declare interface OllamaChatModelResponse extends BaseChatModelResponse {
  type: 'ollama';
  temperature: number;
  base_url?: string | null;
  seed?: number | null;
  num_ctx: number;
  num_predict?: number | null;
  repeat_penalty?: number | null;
  top_k?: number | null;
  top_p?: number | null;
  stop?: string[] | null;
}
