import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/agent-mapper';
import type { Agent } from '../@types/entities';

const EXTENSION_URL = 'api/v1/agent';
export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingAgent', 'Agent'],
  endpoints: (builder) => ({
    getAgentTokenById: builder.mutation<string, string>({
      query: (agentId) => ({
        url: `/${EXTENSION_URL}/${agentId}/export`,
        method: 'GET',
      }),
      transformResponse: (response: string) => response,
    }),
    getAgentById: builder.query<Agent, string>({
      query: (agentId: string) => ({
        url: `/${EXTENSION_URL}/${agentId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Agent',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: AgentResponse) {
        return toEntity(rawResult);
      },
    }),

    getAgents: builder.query<PagingWrapper<Agent>, GetAgentQuery>({
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
          type: 'PagingAgent',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Agent', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<AgentResponse>
      ): PagingWrapper<Agent> => ({
        ...response,
        content: response.content.map(toEntity),
      }),
    }),

    createAgent: builder.mutation<string, CreateAgentRequest>({
      query: (data: CreateAgentRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'PagingAgent' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateAgent: builder.mutation<void, UpdateAgentRequest>({
      query: (data: UpdateAgentRequest) => ({
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
        return [{ type: 'Agent', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteAgent: builder.mutation<void, string>({
      query: (agentId: string) => ({
        url: `/${EXTENSION_URL}/${agentId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const agentId = arg;
        return [
          { type: 'Agent', id: agentId } as const,
          { type: 'PagingAgent' } as const,
        ];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
  }),
});

export const {
  useCreateAgentMutation,
  useGetAgentByIdQuery,
  useGetAgentsQuery,
  useDeleteAgentMutation,
  useUpdateAgentMutation,
  useGetAgentTokenByIdMutation,
} = agentApi;
