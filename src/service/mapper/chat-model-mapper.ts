function toEntity(response: ChatModelResponse): ChatModel {
  const baseFields = {
    id: response.id,
    model_name: response.model_name,
    provider: response.provider,
    temperature: response.temperature,
    top_k: response.top_k ?? null,
    top_p: response.top_p ?? null,
    type: response.type,
  };

  if (response.type === 'ollama') {
    const chatModel: OllamaChatModelPublic = {
      ...baseFields,
      base_url: response.base_url ?? null,
      seed: response.seed ?? null,
      num_ctx: response.num_ctx,
      num_predict: response.num_predict ?? null,
      repeat_penalty: response.repeat_penalty ?? null,
      stop: response.stop ?? null,
      type: 'ollama',
    };
    return chatModel;
  } else if (response.type === 'google_genai') {
    const chatModel: GoogleGenAIChatModelPublic = {
      ...baseFields,
      max_tokens: response.max_tokens ?? 1024,
      max_retries: response.max_retries ?? 6,
      timeout: response.timeout ?? null,
      safety_settings: response.safety_settings ?? null,
      type: 'google_genai',
    };
    return chatModel;
  }

  throw new Error(`Unknown chat model type: ${response.type}`);
}

export { toEntity };
