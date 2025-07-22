declare type ChatModel = OllamaChatModel | GoogleGenAIChatModel;

declare interface BaseChatModel {
  id: string;
  model_name: string;
  type: ChatModelType;
  provider: string;
}

declare interface OllamaChatModel extends BaseChatModel {
  type: 'ollama';
  base_url: string | null;
  seed: number | null;
  num_ctx: number;
  num_predict?: number | null;
  repeat_penalty?: number | null;
  stop: string[] | null;
}

declare interface GoogleGenAIChatModel extends BaseChatModel {
  type: 'google_genai';
  max_tokens: number;
  max_retries: number;
  temperature: number;
  top_k: number | null;
  top_p: number | null;
  timeout?: number | null;
  safety_settings: Record<HarmCategory, HarmBlockThreshold> | null;
}
