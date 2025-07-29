declare interface Agent {
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
declare interface Prompt {
  id: string;
  name: string;
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

export type MCPStreamType = 'streamable_http' | 'stdio';
declare interface MCPStreamableServer {
  id: string;
  name: string; // minLength: 1
  url: string;
  type: MCPStreamType; // default: 'streamable_http'
  headers?: Record<string, string> | null;
  timeout?: number; // default: 30
  sse_read_timeout?: number; // default: 30
  terminate_on_close?: boolean; // default: true
}

declare interface VectorStoreConnection {
  host: string;
  port: number; // > 0
  ssl: boolean;
  headers?: Record<string, string> | null;
}

declare interface ChromaRetriever {
  id: string;
  name: string; // An unique name is used for determining retrievers [1, 100] characters
  weight: number; // Retriever weight for combining results [0, 1]
  mode?: string; // #0"persistent" |  #1"remote"
  connection?: VectorStoreConnection | null;
  collection_name?: string; // Default"agent_collection"
  k?: number; //Amount of documents to return
  tenant: string; // ≥ 1 character Default"default_tenant"
  database: string; // ≥ 1 character Default"default_database"
  type?: string; //Default"chroma_db"
  embeddings_id: string; // ID of the configured embeddings model.
}

declare interface BM25Retriever {
  id: string;
  name: string; // [1, 100] characters
  weight: number; // [0, 1]
  k?: number; // DEFAULT 4
  enable_remove_emoji?: boolean;
  enable_remove_emoticon?: boolean;
  type?: string; //Default"bm25"
  embeddings_id: string;
  removal_words_file_id?: string | null;
}

declare interface File {
  id: string;
  name: string;
  mime_type?: string | null;
  created_at: string;
}

declare interface OutputClass {
  name: string;
  description: string;
}

declare type PreprocessingConfig = ImageResize | ImagePad | ImageGrayscale;
declare interface ImageRecognizer {
  id: string;
  name: string;
  type: string;
  model_file_id: string;
  min_probability: number;
  max_results?: number;
  output_classes: OutputClass[];
  preprocessing_configs: PreprocessingConfig[] | null;
}

declare interface ImageResize {
  type: 'resize';
  target_size: number;
  interpolation?: string;
  max_size?: number | null;
}

declare interface ImagePad {
  type: 'pad';
  padding: number[] | number;
  fill?: number | number[];
  mode?: string;
}

declare interface ImageGrayscale {
  type: 'grayscale';
  num_output_channels: number;
}

declare interface Tool {
  id: string;
  type: string;
  name: string;
  max_results: number; //default 4
}
