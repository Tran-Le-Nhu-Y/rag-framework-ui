import type { ChromaRetriever } from '../../@types/entities';

function toChromaVectorStoreEntity(
  response: ChromaRetrieverResponse
): ChromaRetriever {
  const chroma_vector_store: ChromaRetriever = {
    id: response.id,
    name: response.name,
    mode: response.mode,
    database: response.database,
    embeddings_id: response.embeddings_id,
    weight: response.weight,
    collection_name: response.collection_name,
    tenant: response.tenant,
    connection: response.connection,
    k: response.k,
    type: response.type,
  };
  return chroma_vector_store;
}
export { toChromaVectorStoreEntity };
