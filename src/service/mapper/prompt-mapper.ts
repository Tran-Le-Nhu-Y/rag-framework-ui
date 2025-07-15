function toEntity(response: PromptResponse): Prompt {
  const prompt: Prompt = {
    id: response.id,
    suggest_questions_prompt: response.suggest_questions_prompt,
    respond_prompt: response.respond_prompt,
  };
  return prompt;
}
export { toEntity };
