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
declare interface GetMCPQuery {
  offset?: number?;
  limit?: number?;
}
declare interface GetVectorStoreQuery {
  offset?: number?;
  limit?: number?;
}
declare interface GetBM25Query {
  offset?: number?;
  limit?: number?;
}
declare interface GetToolQuery {
  offset?: number?;
  limit?: number?;
}
declare interface GetImageRecognizerQuery {
  offset?: number?;
  limit?: number?;
}
