declare interface CreatePromptRequest {
  suggestQuestionsPrompt: string;
  respondPrompt: string;
}

declare interface UpdatePromptRequest {
  promptId: string;
  suggestQuestionsPrompt: string;
  respondPrompt: string;
}
