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
  BM25CreationPage,
  BM25ManagementPage,
  BM25UpdatePage,
  ChatModelCreationPage,
  ChatModelManagementPage,
  ChatModelUpdatePage,
  CNNModelCreationPage,
  CNNModelManagementPage,
  CNNModelUpdatePage,
  EmbeddingCreationPage,
  EmbeddingsManagementPage,
  MCPCreationPage,
  MCPManagementPage,
  MCPUpdatePage,
  PromptCreationPage,
  PromptManagementPage,
  PromptUpdatePage,
  UseGuidePage,
  VectorStoreCreationPage,
  VectorStoreManagementPage,
  VectorStoreUpdatePage,
} from './page/index.ts';
import { RoutePaths } from './util/index.ts';
import EmbeddingUpdatePage from './page/EmbeddingUpdate/EmbeddingUpdate.tsx';

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
        path={RoutePaths.UPDATE_CHATMODEL}
        element={<ChatModelUpdatePage />}
      />
      <Route
        path={RoutePaths.EMBEDDINGS}
        element={<EmbeddingsManagementPage />}
      />
      <Route
        path={RoutePaths.CREATE_EMBEDDINGS}
        element={<EmbeddingCreationPage />}
      />
      <Route
        path={RoutePaths.UPDATE_EMBEDDINGS}
        element={<EmbeddingUpdatePage />}
      />

      <Route path={RoutePaths.MCP} element={<MCPManagementPage />} />
      <Route path={RoutePaths.CREATE_MCP} element={<MCPCreationPage />} />
      <Route path={RoutePaths.UPDATE_MCP} element={<MCPUpdatePage />} />

      <Route path={RoutePaths.CNN} element={<CNNModelManagementPage />} />
      <Route path={RoutePaths.CREATE_CNN} element={<CNNModelCreationPage />} />
      <Route path={RoutePaths.UPDATE_CNN} element={<CNNModelUpdatePage />} />

      <Route path={RoutePaths.PROMPT} element={<PromptManagementPage />} />
      <Route path={RoutePaths.CREATE_PROMPT} element={<PromptCreationPage />} />
      <Route path={RoutePaths.UPDATE_PROMPT} element={<PromptUpdatePage />} />

      <Route
        path={RoutePaths.VECTOR_STORE}
        element={<VectorStoreManagementPage />}
      />
      <Route
        path={RoutePaths.CREATE_VECTOR_STORE}
        element={<VectorStoreCreationPage />}
      />
      <Route
        path={RoutePaths.UPDATE_VECTOR_STORE}
        element={<VectorStoreUpdatePage />}
      />

      <Route path={RoutePaths.BM25} element={<BM25ManagementPage />} />
      <Route path={RoutePaths.CREATE_BM25} element={<BM25CreationPage />} />
      <Route path={RoutePaths.UPDATE_BM25} element={<BM25UpdatePage />} />

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
