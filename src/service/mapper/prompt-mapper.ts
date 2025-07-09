function toEntity(response: PromptResponse): Prompt {
  const prompt: Prompt = {
    id: response.id,
    suggestQuestionsPrompt: response.suggestQuestionsPrompt,
    respondPrompt: response.respondPrompt,
  };
  return prompt;
}
export { toEntity };
