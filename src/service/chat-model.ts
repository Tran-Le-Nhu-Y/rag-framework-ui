import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/chat-model-mapper';
import type { ChatModel } from '../@types/entities';

const EXTENSION_URL = 'api/v1/chat-model';
export const chatModelApi = createApi({
  reducerPath: 'chatModelApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingChatModel', 'ChatModel'],
  endpoints: (builder) => ({
    getChatModelById: builder.query<ChatModel, string>({
      query: (chatModelId: string) => ({
        url: `/${EXTENSION_URL}/${chatModelId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'ChatModel',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: ChatModelResponse) {
        return toEntity(rawResult);
      },
    }),

    getChatModels: builder.query<PagingWrapper<ChatModel>, GetChatModelsQuery>({
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
          type: 'PagingChatModel',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'ChatModel', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<ChatModelResponse>
      ): PagingWrapper<ChatModel> => ({
        ...response,
        content: response.content.map(toEntity),
      }),
    }),

    createChatModel: builder.mutation<string, CreateChatModelRequest>({
      query: (data: CreateChatModelRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'PagingChatModel' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateChatModel: builder.mutation<void, UpdateChatModelRequest>({
      query: (data: UpdateChatModelRequest) => ({
        url: `/${EXTENSION_URL}/${data.chatModelId}/update`,
        method: 'PUT',
        body: {
          // Gửi toàn bộ data, trừ `chatModelId`
          ...data,
          chatModelId: undefined,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { chatModelId } = arg;
        return [{ type: 'ChatModel', id: chatModelId } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteChatModel: builder.mutation<void, string>({
      query: (chatModelId: string) => ({
        url: `/${EXTENSION_URL}/${chatModelId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const chatModelId = arg;
        return [
          { type: 'ChatModel', id: chatModelId } as const,
          { type: 'PagingChatModel' } as const,
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
  useGetChatModelByIdQuery,
  useGetChatModelsQuery,
  useCreateChatModelMutation,
  useUpdateChatModelMutation,
  useDeleteChatModelMutation,
} = chatModelApi;
