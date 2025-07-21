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
  PromptCreationPage,
  PromptManagementPage,
  PromptUpdatePage,
  RecognitionModelCreationPage,
  RecognitionModelManagementPage,
  UseGuidePage,
} from './page/index.ts';
import { RoutePaths } from './util/index.ts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<AgentManagementPage />} />
      <Route path={RoutePaths.AGENT} element={<AgentManagementPage />} />
      <Route path={RoutePaths.CREATE_AGENT} element={<AgentCreationPage />} />
      <Route path={RoutePaths.UPDATE_AGENT} element={<AgentUpdatePage />} />
      <Route path={RoutePaths.AGENT_DETAIL} element={<AgentDetailPage />} />

      <Route
        path={RoutePaths.CHATMODEL}
        element={<ChatModelManagementPage />}
      />
      <Route
        path={RoutePaths.CREATE_CHATMODEL}
        element={<ChatModelCreationPage />}
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
      <Route path="use-guide" element={<UseGuidePage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  </Provider>
);
