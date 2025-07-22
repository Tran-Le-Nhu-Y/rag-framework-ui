import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/mcp-mapper';

const EXTENSION_URL = 'api/v1/mcp';
export const mcpApi = createApi({
  reducerPath: 'mcpApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingMCP', 'MCP'],
  endpoints: (builder) => ({
    getMCPById: builder.query<MCPPublic, string>({
      query: (mcpId: string) => ({
        url: `/${EXTENSION_URL}/${mcpId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'MCP',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: MCPResponse) {
        return toEntity(rawResult);
      },
    }),

    getMCPs: builder.query<PagingWrapper<MCPPublic>, GetMCPQuery>({
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
          type: 'PagingMCP',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(({ id }) => ({ type: 'MCP', id } as const)),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<MCPResponse>
      ): PagingWrapper<MCPPublic> => ({
        ...response,
        content: response.content.map(toEntity),
      }),
    }),

    createMCP: builder.mutation<string, CreateMCPRequest>({
      query: (data: CreateMCPRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'MCP' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateMCP: builder.mutation<void, UpdateMCPRequest>({
      query: (data: UpdateMCPRequest) => ({
        url: `/${EXTENSION_URL}/${data.id}/update`,
        method: 'PUT',
        body: {
          // Gửi toàn bộ data, trừ `ID`
          ...data,
          id: undefined,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { id } = arg;
        return [{ type: 'MCP', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteMCP: builder.mutation<void, string>({
      query: (mcpId: string) => ({
        url: `/${EXTENSION_URL}/${mcpId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const mcpId = arg;
        return [
          { type: 'MCP', id: mcpId } as const,
          { type: 'PagingMCP' } as const,
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
  useCreateMCPMutation,
  useGetMCPsQuery,
  useGetMCPByIdQuery,
  useDeleteMCPMutation,
  useUpdateMCPMutation,
} = mcpApi;
