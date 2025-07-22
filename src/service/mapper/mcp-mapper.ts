function toEntity(response: MCPResponse): MCPPublic {
  return {
    id: response.id,
    servers: response.servers,
  };
}

export { toEntity };
