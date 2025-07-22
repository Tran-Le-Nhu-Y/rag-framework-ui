declare type ChatModel = OllamaChatModel | GoogleGenAIChatModel;

declare interface BaseChatModel {
  id: string;
  modelName: string;
  type: ChatModelType;
}

declare interface OllamaChatModel extends BaseChatModel {
  type: 'ollama';
  baseUrl: string | null;
  seed: number | null;
  numCtx: number;
  numPredict?: number | null;
  repeatPenalty?: number | null;
  stop: string[] | null;
}

declare interface GoogleGenAIChatModel extends BaseChatModel {
  type: 'google_genai';
  maxTokens: number;
  maxRetries: number;
  temperature: number;
  topK: number | null;
  topP: number | null;
  timeout?: number | null;
  safetySettings: Record<HarmCategory, HarmBlockThreshold> | null;
}
