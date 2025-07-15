import { configureStore } from '@reduxjs/toolkit';
import { promptApi } from '../service/prompt';

export const store = configureStore({
  reducer: {
    [promptApi.reducerPath]: promptApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(promptApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
