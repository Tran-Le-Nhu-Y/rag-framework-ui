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
  AgentManagementPage,
  RecognitionModelManagementPage,
  TrainingDataManagementPage,
  TrainingMonitoringPage,
} from './page/index.ts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<AgentManagementPage />} />

      <Route
        path="training-data-management"
        element={<TrainingDataManagementPage />}
      />
      <Route
        path="recognition-model-management"
        element={<RecognitionModelManagementPage />}
      />
      <Route path="trainting-monitoring" element={<TrainingMonitoringPage />} />
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
