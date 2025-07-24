import type { Prompt } from '../../@types/entities';

function toEntity(response: PromptResponse): Prompt {
  const prompt: Prompt = {
    id: response.id,
    name: response.name,
    respond_prompt: response.respond_prompt,
  };
  return prompt;
}
export { toEntity };
