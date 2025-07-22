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
        baseUrl: data.base_url ?? null,
        seed: data.seed ?? null,
        numCtx: data.num_ctx,
        numPredict: data.num_predict ?? null,
        repeatPenalty: data.repeat_penalty ?? null,
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
        topK: data.top_k ?? null,
        topP: data.top_p ?? null,
        maxTokens: data.max_tokens ?? 1024,
        maxRetries: data.max_retries ?? 6,
        timeout: data.timeout ?? null,
        safetySettings: data.safety_settings ?? null,
      };
      return chatModel;
    }
    default:
      throw new Error(`Unknown chat model type.`);
  }
}

export { toEntity };
