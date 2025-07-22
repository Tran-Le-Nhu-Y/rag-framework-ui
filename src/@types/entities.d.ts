declare interface Agent {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
declare interface Prompt {
  id: string;
  suggest_questions_prompt: string;
  respond_prompt: string;
}

declare type EmbeddingType = 'google_genai' | 'hugging_face';
declare type Embeddings = HuggingFaceEmbeddings | GoogleGenAIEmbeddings;

declare interface BaseEmbeddings {
  id: string;
  name: string;
  model_name: string;
  type: EmbeddingType;
}

declare interface HuggingFaceEmbeddings extends BaseEmbeddings {
  type: 'hugging_face';
}
// declare interface HuggingFaceEmbeddings extends BaseEmbeddings {}
declare interface GoogleGenAIEmbeddings extends BaseEmbeddings {
  task_type?: string | null;
  type: 'google_genai';
}

declare interface OutputClass {
  name: string;
  description: string;
}

declare type RetrieverType = 'bm25' | 'chroma_db';
declare type ChatModelType = 'google_genai' | 'ollama';
declare type ChatModel = OllamaChatModelPublic | GoogleGenAIChatModelPublic;

declare interface BaseChatModel {
  id: string;
  model_name: string;
  provider: string;
  temperature: number;
  top_k?: number | null;
  top_p?: number | null;
  type: ChatModelType;
}

declare interface OllamaChatModelPublic extends BaseChatModel {
  base_url?: string | null;
  seed?: number | null;
  num_ctx: number;
  num_predict?: number | null;
  repeat_penalty?: number | null;
  stop?: string[] | null;
  type: 'ollama';
}
declare interface GoogleGenAIChatModelPublic extends BaseChatModel {
  max_tokens: number;
  max_retries: number;
  timeout?: number | null;
  safety_settings?: Record<string, string> | null;
  type: 'google_genai';
}
