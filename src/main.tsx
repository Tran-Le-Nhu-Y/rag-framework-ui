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
  PromptCreationPage,
  PromptManagementPage,
  PromptUpdatePage,
  RecognitionModelCreationPage,
  RecognitionModelManagementPage,
  UseGuidePage,
} from './page/index.ts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<AgentManagementPage />} />
      <Route path="agent-creation" element={<AgentCreationPage />} />
      <Route path="agent-update" element={<AgentUpdatePage />} />
      <Route path="agent-detail" element={<AgentDetailPage />} />
      <Route
        path="recognition-model-management"
        element={<RecognitionModelManagementPage />}
      />
      <Route
        path="recognition-model-creation"
        element={<RecognitionModelCreationPage />}
      />
      <Route path="prompt-management" element={<PromptManagementPage />} />
      <Route path="prompt-creation" element={<PromptCreationPage />} />
      <Route path="prompt-update" element={<PromptUpdatePage />} />
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
