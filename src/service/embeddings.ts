import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/embeddings-mapper';
import type { Embeddings } from '../@types/entities';

const EXTENSION_URL = 'api/v1/embeddings';
export const embeddingsApi = createApi({
  reducerPath: 'embeddingsApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingEmbeddings', 'Embeddings'],
  endpoints: (builder) => ({
    getEmbeddingById: builder.query<Embeddings, string>({
      query: (embeddingModelId: string) => ({
        url: `/${EXTENSION_URL}/${embeddingModelId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Embeddings',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: EmbeddingsResponse) {
        return toEntity(rawResult);
      },
    }),

    getEmbeddings: builder.query<PagingWrapper<Embeddings>, GetEmbeddingsQuery>(
      {
        query: ({ offset = 0, limit = 100 }) => ({
          url: `/${EXTENSION_URL}/all`,
          method: 'GET',
          params: {
            offset: offset,
            limit: limit,
          },
        }),

        providesTags(result) {
          const pagingTag = {
            type: 'PagingEmbeddings',
            id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
          } as const;

          return result
            ? [
                ...result.content.map(
                  ({ id }) => ({ type: 'Embeddings', id } as const)
                ),
                pagingTag,
              ]
            : [pagingTag];
        },
        transformErrorResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.status;
        },
        transformResponse: (
          response: PagingWrapper<EmbeddingsResponse>
        ): PagingWrapper<Embeddings> => ({
          ...response,
          content: response.content.map(toEntity),
        }),
      }
    ),

    createEmbeddingModel: builder.mutation<string, CreateEmbeddingRequest>({
      query: (data: CreateEmbeddingRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'PagingEmbeddings' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateEmbeddingModel: builder.mutation<void, UpdateEmbeddingRequest>({
      query: (data: UpdateEmbeddingRequest) => ({
        url: `/${EXTENSION_URL}/${data.id}/update`,
        method: 'PUT',
        body: {
          // Gửi toàn bộ data, trừ `chatModelId`
          ...data,
          id: undefined,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { id } = arg;
        return [{ type: 'Embeddings', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteEmbeddingModel: builder.mutation<void, string>({
      query: (embeddingId: string) => ({
        url: `/${EXTENSION_URL}/${embeddingId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const embeddingId = arg;
        return [
          { type: 'Embeddings', id: embeddingId } as const,
          { type: 'PagingEmbeddings' } as const,
        ];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEmbeddingByIdQuery,
  useGetEmbeddingsQuery,
  useCreateEmbeddingModelMutation,
  useUpdateEmbeddingModelMutation,
  useDeleteEmbeddingModelMutation,
} = embeddingsApi;
