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
  suggest_questions_prompt: string;
  respond_prompt: string;
}

declare interface EmbeddingsResponse {
  id: string;
  name: string;
  model_name: string;
  type: EmbeddingType;
  task_type?: GoogleGenAIEmbeddingsTaskType;
}
