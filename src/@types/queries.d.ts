declare interface GetAllAgentQuery {
  userId: string;
  agentName?: string?;
  pageNumber?: number?;
  pageSize?: number?;
}

declare interface GetPromptsQuery {
  offset?: number?;
  limit?: number?;
}

declare interface GetChatModelsQuery {
  offset?: number?;
  limit?: number?;
}

declare interface GetEmbeddingsQuery {
  offset?: number?;
  limit?: number?;
}
