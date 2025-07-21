import { configureStore } from '@reduxjs/toolkit';
import { promptApi } from '../service/prompt';
import { chatModelApi } from '../service/chat-model';
import { embeddingsApi } from '../service/embeddings';

export const store = configureStore({
  reducer: {
    [promptApi.reducerPath]: promptApi.reducer,
    [chatModelApi.reducerPath]: chatModelApi.reducer,
    [embeddingsApi.reducerPath]: embeddingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      promptApi.middleware,
      chatModelApi.middleware,
      embeddingsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
