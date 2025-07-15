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
