import type { MCPStreamableServer } from '../../@types/entities';

function toEntity(response: MCPStreamableServerResponse): MCPStreamableServer {
  return {
    id: response.id,
    name: response.name,
    type: response.type,
    url: response.url,
    headers: response.headers,
    sse_read_timeout: response.sse_read_timeout,
    terminate_on_close: response.terminate_on_close,
    timeout: response.timeout,
  };
}

export { toEntity };
