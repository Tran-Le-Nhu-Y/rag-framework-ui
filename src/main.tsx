import { createRoot } from 'react-dom/client';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './i18n';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import RootLayout from './layout/RootLayout.tsx';

import {
  AgentCreationPage,
  AgentDetailPage,
  AgentManagementPage,
  AgentUpdatePage,
  ChatModelCreationPage,
  ChatModelManagementPage,
  ChatModelUpdatePage,
  PromptCreationPage,
  PromptManagementPage,
  PromptUpdatePage,
  RecognitionModelCreationPage,
  RecognitionModelManagementPage,
  UseGuidePage,
} from './page/index.ts';
import { RoutePaths } from './util/index.ts';
import AppSnackbar from './component/AppSnackbar.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<AgentManagementPage />} />
      <Route path={RoutePaths.AGENT} element={<AgentManagementPage />} />
      <Route path={RoutePaths.CREATE_AGENT} element={<AgentCreationPage />} />
      <Route path={RoutePaths.UPDATE_AGENT} element={<AgentUpdatePage />} />
      <Route path={RoutePaths.AGENT_DETAIL} element={<AgentDetailPage />} />

      <Route
        path={RoutePaths.CHAT_MODEL}
        element={<ChatModelManagementPage />}
      />
      <Route
        path={RoutePaths.CREATE_CHAT_MODEL}
        element={<ChatModelCreationPage />}
      />
      <Route
        path={RoutePaths.UPDATE_CHAT_MODEL}
        element={<ChatModelUpdatePage />}
      />

      <Route
        path="recognition-model-management"
        element={<RecognitionModelManagementPage />}
      />
      <Route
        path="recognition-model-creation"
        element={<RecognitionModelCreationPage />}
      />

      <Route path={RoutePaths.PROMPT} element={<PromptManagementPage />} />
      <Route path={RoutePaths.CREATE_PROMPT} element={<PromptCreationPage />} />
      <Route path={RoutePaths.UPDATE_PROMPT} element={<PromptUpdatePage />} />
      {/* <Route path="prompt-creation" element={<PromptCreationPage />} />
      <Route path="prompt-update" element={<PromptUpdatePage />} /> */}
      <Route path={RoutePaths.USER_GUIDE} element={<UseGuidePage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppSnackbar>
          <RouterProvider router={router} />
        </AppSnackbar>
      </LocalizationProvider>
    </ThemeProvider>
  </Provider>
);
