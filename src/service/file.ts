import { createApi } from '@reduxjs/toolkit/query/react';
import { ragFrameworkInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/file-mapper';
import type { File } from '../@types/entities';

const EXTENSION_URL = 'api/v1/file';
export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: axiosBaseQuery(ragFrameworkInstance),
  tagTypes: ['PagingFile', 'File'],
  endpoints: (builder) => ({
    getFileById: builder.query<File, string>({
      query: (fileId: string) => ({
        url: `/${EXTENSION_URL}/${fileId}/metadata`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'File',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: FileResponse) {
        return toEntity(rawResult);
      },
    }),

    getTokenById: builder.mutation<string, string>({
      query: (fileId) => ({
        url: `/${EXTENSION_URL}/${fileId}/token`,
        method: 'GET',
      }),
      transformResponse: (response: string) => response,
    }),

    postFile: builder.mutation<string, UploadFileRequest>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `/${EXTENSION_URL}/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags() {
        return [{ type: 'File' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteFile: builder.mutation<void, string>({
      query: (fileId: string) => ({
        url: `/${EXTENSION_URL}/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const fileId = arg;
        return [{ type: 'File', id: fileId } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
  }),
});

export const {
  useGetFileByIdQuery,
  useDeleteFileMutation,
  usePostFileMutation,
  useGetTokenByIdMutation,
} = fileApi;
