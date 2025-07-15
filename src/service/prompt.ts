import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/prompt-mapper';

const EXTENSION_URL = 'api/v1/prompt';
export const promptApi = createApi({
  reducerPath: 'promptApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingPrompt', 'Prompt'],
  endpoints: (builder) => ({
    getPromptById: builder.query<Prompt, string>({
      query: (promptId: string) => ({
        url: `/${EXTENSION_URL}/${promptId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Prompt',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: PromptResponse) {
        return toEntity(rawResult);
      },
    }),

    getPrompts: builder.query<PagingWrapper<Prompt>, GetPromptsQuery>({
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
          type: 'PagingPrompt',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Prompt', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(
        rawResult: PagingWrapper<PromptResponse>
      ): PagingWrapper<Prompt> {
        const content = rawResult.content;
        if (!content || content.length === 0) {
          return {
            ...rawResult,
            content: [],
          };
        }
        // Map each PromptResponse to Prompt entity
        const mappedContent: Prompt[] = content.map(toEntity);

        return {
          ...rawResult,
          content: mappedContent,
        };
      },
    }),

    createPrompt: builder.mutation<string, CreatePromptRequest>({
      query: (data: CreatePromptRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: {
          suggest_questions_prompt: data.suggestQuestionsPrompt,
          respond_prompt: data.respondPrompt,
        },
      }),
      invalidatesTags() {
        return [{ type: 'Prompt' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updatePrompt: builder.mutation<void, UpdatePromptRequest>({
      query: (data: UpdatePromptRequest) => ({
        url: `/${EXTENSION_URL}/${data.promptId}/update`,
        method: 'PUT',
        body: {
          suggest_questions_prompt: data.suggestQuestionsPrompt,
          respond_prompt: data.respondPrompt,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { promptId } = arg;
        return [{ type: 'Prompt', id: promptId } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deletePrompt: builder.mutation<void, string>({
      query: (promptId: string) => ({
        url: `/${EXTENSION_URL}/${promptId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const promptId = arg;
        return [
          { type: 'Prompt', id: promptId } as const,
          { type: 'PagingPrompt' } as const,
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
  useGetPromptByIdQuery,
  useGetPromptsQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
} = promptApi;
