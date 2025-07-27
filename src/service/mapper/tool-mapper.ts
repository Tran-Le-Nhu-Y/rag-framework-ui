import type { Tool } from '../../@types/entities';

function toEntity(response: ToolResponse): Tool {
  const tool: Tool = {
    id: response.id,
    name: response.name,
    type: response.type,
    max_results: response.max_results,
  };
  return tool;
}
export { toEntity };
