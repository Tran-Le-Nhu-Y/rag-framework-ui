function toEntity(response: ChatModelResponse): ChatModel {
  const baseFields = {
    id: response.id,
    modelName: response.model_name,
  };

  switch (response.type) {
    case 'ollama': {
      const data = response as OllamaChatModelResponse;
      const chatModel: OllamaChatModel = {
        ...baseFields,
        type: 'ollama',
        base_url: data.base_url ?? null,
        seed: data.seed ?? null,
        num_ctx: data.num_ctx,
        num_predict: data.num_predict ?? null,
        repeat_penalty: data.repeat_penalty ?? null,
        stop: data.stop ?? null,
      };
      return chatModel;
    }
    case 'google_genai': {
      const data = response as GoogleGenAIChatModelResponse;
      const chatModel: GoogleGenAIChatModel = {
        ...baseFields,
        type: 'google_genai',
        temperature: data.temperature,
        top_k: data.top_k ?? null,
        top_p: data.top_p ?? null,
        max_tokens: data.max_tokens ?? 1024,
        max_retries: data.max_retries ?? 6,
        timeout: data.timeout ?? null,
        safety_settings: data.safety_settings ?? null,
      };
      return chatModel;
    }
    default:
      throw new Error(`Unknown chat model type.`);
  }
}

export { toEntity };
