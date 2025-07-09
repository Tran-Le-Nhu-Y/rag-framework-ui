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
