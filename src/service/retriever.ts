import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import type { BM25Retriever, ChromaRetriever } from '../@types/entities';
import { toChromaVectorStoreEntity } from './mapper/chroma-retriever-mapper';
import { toBM25Entity } from './mapper/bm25-mapper';
import { DeleteError } from '../util/errors';

const EXTENSION_URL = 'api/v1/retriever';
export const retrieverApi = createApi({
  reducerPath: 'retrieverApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingVectorStore', 'VectorStore', 'PagingBM25', 'BM25'],
  endpoints: (builder) => ({
    getVectorStoreById: builder.query<ChromaRetriever, string>({
      query: (storeId: string) => ({
        url: `/${EXTENSION_URL}/vector-store/${storeId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'VectorStore',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: ChromaRetrieverResponse) {
        return toChromaVectorStoreEntity(rawResult);
      },
    }),
    getVectorStores: builder.query<
      PagingWrapper<ChromaRetriever>,
      GetVectorStoreQuery
    >({
      query: ({ offset = 0, limit = 100 }) => ({
        url: `/${EXTENSION_URL}/vector-store/all`,
        method: 'GET',
        params: {
          offset: offset,
          limit: limit,
        },
      }),

      providesTags(result) {
        const pagingTag = {
          type: 'PagingVectorStore',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'VectorStore', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<ChromaRetrieverResponse>
      ): PagingWrapper<ChromaRetriever> => ({
        ...response,
        content: response.content.map(toChromaVectorStoreEntity),
      }),
    }),

    createVectorStore: builder.mutation<string, CreateChromaRetrieverRequest>({
      query: (data: CreateChromaRetrieverRequest) => ({
        url: `/${EXTENSION_URL}/vector-store/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'PagingVectorStore' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateVectorStore: builder.mutation<void, UpdateChromaRetrieverRequest>({
      query: (data: UpdateChromaRetrieverRequest) => ({
        url: `/${EXTENSION_URL}/vector-store/${data.id}/update`,
        method: 'PUT',
        body: {
          // Gửi toàn bộ data, trừ `chatModelId`
          ...data,
          id: undefined,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { id } = arg;
        return [{ type: 'VectorStore', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    getBM25ById: builder.query<BM25Retriever, string>({
      query: (bm25Id: string) => ({
        url: `/${EXTENSION_URL}/bm25/${bm25Id}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'BM25',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: BM25RetrieverResponse) {
        return toBM25Entity(rawResult);
      },
    }),
    getBM25s: builder.query<PagingWrapper<BM25Retriever>, GetBM25Query>({
      query: ({ offset = 0, limit = 100 }) => ({
        url: `/${EXTENSION_URL}/bm25/all`,
        method: 'GET',
        params: {
          offset: offset,
          limit: limit,
        },
      }),

      providesTags(result) {
        const pagingTag = {
          type: 'PagingBM25',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'BM25', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<BM25RetrieverResponse>
      ): PagingWrapper<BM25Retriever> => ({
        ...response,
        content: response.content.map(toBM25Entity),
      }),
    }),

    createBM25: builder.mutation<string, CreateBM25RetrieverRequest>({
      query: (data: CreateBM25RetrieverRequest) => ({
        url: `/${EXTENSION_URL}/bm25/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'PagingBM25' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateBM25: builder.mutation<void, UpdateBM25RetrieverRequest>({
      query: (data: UpdateBM25RetrieverRequest) => ({
        url: `/${EXTENSION_URL}/bm25/${data.id}/update`,
        method: 'PUT',
        body: {
          // Gửi toàn bộ data, trừ `chatModelId`
          ...data,
          id: undefined,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { id } = arg;
        return [{ type: 'BM25', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteRetriever: builder.mutation<void, string>({
      query: (retrieverId: string) => ({
        url: `/${EXTENSION_URL}/${retrieverId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const retrieverId = arg;
        return [
          { type: 'VectorStore', id: retrieverId } as const,
          { type: 'PagingVectorStore' } as const,
          { type: 'BM25', id: retrieverId } as const,
          { type: 'PagingBM25' } as const,
        ];
      },
      transformErrorResponse(baseQueryReturnValue) {
        const status = baseQueryReturnValue.status;
        const { message } = baseQueryReturnValue.data as { message: string };
        if (
          status === 406 &&
          message.includes('Cannot delete chat model with id') &&
          message.includes('. Agent with id ') &&
          message.includes('is still using it.')
        )
          return DeleteError.BEING_USED;
        return DeleteError.UNKNOWN_ERROR;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetVectorStoresQuery,
  useGetVectorStoreByIdQuery,
  useCreateVectorStoreMutation,
  useUpdateVectorStoreMutation,
  useDeleteRetrieverMutation,
  useCreateBM25Mutation,
  useGetBM25ByIdQuery,
  useGetBM25sQuery,
  useUpdateBM25Mutation,
} = retrieverApi;
