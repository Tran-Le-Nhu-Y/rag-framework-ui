import { configureStore } from '@reduxjs/toolkit';
import { promptApi } from '../service/prompt';
import { chatModelApi } from '../service/chat-model';
import { embeddingsApi } from '../service/embeddings';
import { mcpApi } from '../service/mcp';
import { retrieverApi } from '../service/retriever';
import { fileApi } from '../service/file';
import { toolApi } from '../service/tool';

export const store = configureStore({
  reducer: {
    [promptApi.reducerPath]: promptApi.reducer,
    [chatModelApi.reducerPath]: chatModelApi.reducer,
    [embeddingsApi.reducerPath]: embeddingsApi.reducer,
    [mcpApi.reducerPath]: mcpApi.reducer,
    [retrieverApi.reducerPath]: retrieverApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [toolApi.reducerPath]: toolApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      promptApi.middleware,
      chatModelApi.middleware,
      embeddingsApi.middleware,
      mcpApi.middleware,
      retrieverApi.middleware,
      fileApi.middleware,
      toolApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
