import type { BM25Retriever } from '../../@types/entities';

function toBM25Entity(response: BM25RetrieverResponse): BM25Retriever {
  const bm25: BM25Retriever = {
    id: response.id,
    name: response.name,
    embeddings_id: response.embeddings_id,
    weight: response.weight,
    k: response.k,
    type: response.type,
    embeddings_model: response.embeddings_model,
    enable_remove_emoji: response.enable_remove_emoji,
    enable_remove_emoticon: response.enable_remove_emoticon,
    removal_words_file_id: response.removal_words_file_id,
  };
  return bm25;
}
export { toBM25Entity };
