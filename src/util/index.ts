import type { AlertColor } from '@mui/material';
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from 'axios';
import dayjs, { Dayjs } from 'dayjs';

export const TextLength = {
  SHORT: 6,
  MEDIUM: 100,
  LONG: 150,
  VERY_LONG: 255,
  EXTREME_LONG: 60000,
};

export const PathHolders = {
  ROOT: '/',
  AGENT_ID: 'agentId',
  PROMPT_ID: 'promptId',
  CHAT_MODEL_ID: 'chatModelId',
  EMBEDDING_MODEL_ID: 'embeddingModelId',
  MCP_ID: 'mcpId',
  VECTOR_STORE_ID: 'vectorStoreId',
  BM25_ID: 'bm25Id',
};
const AGENT = '/agent';
const PROMPT = '/prompt';
const CHATMODEL = '/chat-model';
const EMBEDDINGS = '/embedding';
const MCP = '/mcp';
const VECTOR_STORE = '/vector-store';
const BM25 = '/bm25';
export const RoutePaths = {
  AGENT,
  CREATE_AGENT: `${AGENT}/create`,
  UPDATE_AGENT: `${AGENT}/:${PathHolders.AGENT_ID}/update`,
  AGENT_DETAIL: `${AGENT}/:${PathHolders.AGENT_ID}/detail`,

  PROMPT,
  CREATE_PROMPT: `${PROMPT}/create`,
  UPDATE_PROMPT: `${PROMPT}/:${PathHolders.PROMPT_ID}/update`,

  CHATMODEL,
  CREATE_CHATMODEL: `${CHATMODEL}/create`,
  UPDATE_CHATMODEL: `${CHATMODEL}/:${PathHolders.CHAT_MODEL_ID}/update`,

  EMBEDDINGS,
  CREATE_EMBEDDINGS: `${EMBEDDINGS}/create`,
  UPDATE_EMBEDDINGS: `${EMBEDDINGS}/:${PathHolders.EMBEDDING_MODEL_ID}/update`,

  MCP,
  CREATE_MCP: `${MCP}/create`,
  UPDATE_MCP: `${MCP}/:${PathHolders.MCP_ID}/update`,

  VECTOR_STORE,
  CREATE_VECTOR_STORE: `${VECTOR_STORE}/create`,
  UPDATE_VECTOR_STORE: `${VECTOR_STORE}/:${PathHolders.VECTOR_STORE_ID}/update`,

  BM25,
  CREATE_BM25: `${BM25}/create`,
  UPDATE_BM25: `${BM25}/:${PathHolders.BM25_ID}/update`,
};

export const HideDuration = {
  FAST: 3000,
  NORMAL: 5000,
  SLOW: 7000,
};

export const SnackbarSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
} as const;
export type SnackbarSeverity = AlertColor;

export const axiosQueryHandler = async <T>(func: () => Promise<T>) => {
  try {
    const result = await func();
    return { data: result };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response!.status!,
        data: err.response?.data || err.message,
      },
    };
  }
};

export const axiosBaseQuery =
  (
    instance: AxiosInstance
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      body?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    FetchBaseQueryError
  > =>
  async ({ url, method, body, params, headers }) => {
    try {
      const result = await instance({
        url,
        method,
        data: body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response!.status!,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export function createAxiosInstance(config?: CreateAxiosDefaults) {
  const instance = axios.create(config);

  instance.interceptors.request.use(
    async function (config) {
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  return instance;
}

export function getFileSize(bytes: number) {
  if (bytes < 1e3) return `${bytes} bytes`;
  else if (bytes >= 1e3 && bytes < 1e6) return `${(bytes / 1e3).toFixed(1)} KB`;
  else return `${(bytes / 1e6).toFixed(1)} MB`;
}

export const convertToAPIDateFormat = (date: Dayjs) => {
  return date.format('YYYY-MM-DD');
};

export const parseToDayjs = (date: string) => {
  return dayjs(date, 'YYYY-MM-DD');
};

export type TextLengthValue = (typeof TextLength)[keyof typeof TextLength];
export const isValidLength = (text: string, length: TextLengthValue) =>
  text.length <= length;
