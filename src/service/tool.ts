import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/tool-mapper';
import type { Tool } from '../@types/entities';

const EXTENSION_URL = 'api/v1/tool';
export const toolApi = createApi({
  reducerPath: 'toolApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingTool', 'Tool'],
  endpoints: (builder) => ({
    getToolById: builder.query<Tool, string>({
      query: (toolId: string) => ({
        url: `/${EXTENSION_URL}/${toolId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Tool',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: ToolResponse) {
        return toEntity(rawResult);
      },
    }),

    getTools: builder.query<PagingWrapper<Tool>, GetToolQuery>({
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
          type: 'PagingTool',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Tool', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<Tool>
      ): PagingWrapper<Tool> => ({
        ...response,
        content: response.content.map(toEntity),
      }),
    }),

    createTool: builder.mutation<string, CreateToolRequest>({
      query: (data: CreateToolRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: {
          name: data.name,
          type: data.type,
          max_results: data.max_results,
        },
      }),
      invalidatesTags() {
        return [{ type: 'PagingTool' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateTool: builder.mutation<void, UpdateToolRequest>({
      query: (data: UpdateToolRequest) => ({
        url: `/${EXTENSION_URL}/${data.id}/update`,
        method: 'PUT',
        body: {
          name: data.name,
          type: data.type,
          max_results: data.max_results,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { id } = arg;
        return [{ type: 'Tool', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteTool: builder.mutation<void, string>({
      query: (toolId: string) => ({
        url: `/${EXTENSION_URL}/${toolId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const toolId = arg;
        return [
          { type: 'Tool', id: toolId } as const,
          { type: 'PagingTool' } as const,
        ];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
  }),
});

export const {
  useCreateToolMutation,
  useGetToolByIdQuery,
  useGetToolsQuery,
  useDeleteToolMutation,
  useUpdateToolMutation,
} = toolApi;
