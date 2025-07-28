import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/image-recognizer-mapper';
import type { ImageRecognizer } from '../@types/entities';

const EXTENSION_URL = 'api/v1/recognizer';
export const recognizerApi = createApi({
  reducerPath: 'recognizerApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingRecognizer', 'Recognizer'],
  endpoints: (builder) => ({
    getRecognizerById: builder.query<ImageRecognizer, string>({
      query: (recognizerId: string) => ({
        url: `/${EXTENSION_URL}/${recognizerId}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Recognizer',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: ImageRecognizerResponse) {
        return toEntity(rawResult);
      },
    }),

    getRecognizer: builder.query<
      PagingWrapper<ImageRecognizer>,
      GetImageRecognizerQuery
    >({
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
          type: 'PagingRecognizer',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Recognizer', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse: (
        response: PagingWrapper<ImageRecognizerResponse>
      ): PagingWrapper<ImageRecognizer> => ({
        ...response,
        content: response.content.map(toEntity),
      }),
    }),

    createRecognizer: builder.mutation<string, CreateImageRecognizerRequest>({
      query: (data: CreateImageRecognizerRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags() {
        return [{ type: 'PagingRecognizer' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
    updateRecognizer: builder.mutation<void, UpdateImageRecognizerRequest>({
      query: (data: UpdateImageRecognizerRequest) => ({
        url: `/${EXTENSION_URL}/${data.id}/update`,
        method: 'PUT',
        body: {
          // Gửi toàn bộ data, trừ `id`
          ...data,
          id: undefined,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { id } = arg;
        return [{ type: 'Recognizer', id: id } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteRecognizer: builder.mutation<void, string>({
      query: (recognizerId: string) => ({
        url: `/${EXTENSION_URL}/${recognizerId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const recognizerId = arg;
        return [
          { type: 'Recognizer', id: recognizerId } as const,
          { type: 'PagingRecognizer' } as const,
        ];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
  }),
});

export const {
  useCreateRecognizerMutation,
  useUpdateRecognizerMutation,
  useGetRecognizerByIdQuery,
  useDeleteRecognizerMutation,
  useGetRecognizerQuery,
} = recognizerApi;
