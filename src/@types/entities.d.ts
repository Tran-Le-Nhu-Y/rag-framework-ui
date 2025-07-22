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

declare type Embeddings = HuggingFaceEmbeddings | GoogleGenAIEmbeddings;

declare interface HuggingFaceEmbeddings {
  id: string;
  name: string;
  model_name: string;
  type: EmbeddingType;
}

// declare interface HuggingFaceEmbeddings extends BaseEmbeddings {}
declare interface GoogleGenAIEmbeddings extends HuggingFaceEmbeddings {
  task_type: GoogleGenAIEmbeddingsTaskType;
}

declare interface OutputClass {
  name: string;
  description: string;
}
