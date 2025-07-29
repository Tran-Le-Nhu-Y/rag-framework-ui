import type { Agent } from '../../@types/entities';

function toEntity(response: AgentResponse): Agent {
  const agent: Agent = {
    id: response.id,
    name: response.name,
    description: response.description,
    image_recognizer_id: response.image_recognizer_id,
    language: response.language,
    llm_id: response.llm_id,
    prompt_id: response.prompt_id,
    retriever_ids: response.retriever_ids,
    mcp_server_ids: response.mcp_server_ids,
    tool_ids: response.tool_ids,
  };
  return agent;
}
export { toEntity };
