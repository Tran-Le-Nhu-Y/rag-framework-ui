import {
  useGetChatModelByIdQuery as useGetChatModelById,
  useGetChatModelsQuery as useGetChatModels,
  useCreateChatModelMutation as useCreateChatModel,
  useUpdateChatModelMutation as useUpdateChatModel,
  useDeleteChatModelMutation as useDeleteChatModel,
} from './chat-model';
export {
  useGetChatModelById,
  useGetChatModels,
  useCreateChatModel,
  useUpdateChatModel,
  useDeleteChatModel,
};

import {
  useGetPromptByIdQuery as useGetPromptById,
  useGetPromptsQuery as useGetPrompts,
  useCreatePromptMutation as useCreatePrompt,
  useUpdatePromptMutation as useUpdatePrompt,
  useDeletePromptMutation as useDeletePrompt,
} from './prompt';
export {
  useGetPromptById,
  useGetPrompts,
  useCreatePrompt,
  useUpdatePrompt,
  useDeletePrompt,
};

import {
  useGetEmbeddingByIdQuery as useGetEmbeddingById,
  useGetEmbeddingsQuery as useGetEmbeddings,
  useCreateEmbeddingModelMutation as useCreateEmbeddingModel,
  useUpdateEmbeddingModelMutation as useUpdateEmbeddingModel,
  useDeleteEmbeddingModelMutation as useDeleteEmbeddingModel,
} from './embeddings';
export {
  useGetEmbeddingById,
  useGetEmbeddings,
  useCreateEmbeddingModel,
  useUpdateEmbeddingModel,
  useDeleteEmbeddingModel,
};

import {
  useCreateMCPMutation as useCreateMCP,
  useGetMCPsQuery as useGetMCPs,
  useGetMCPByIdQuery as useGetMCPById,
  useDeleteMCPMutation as useDeleteMCP,
  useUpdateMCPMutation as useUpdateMCP,
} from './mcp';
export { useCreateMCP, useGetMCPs, useGetMCPById, useDeleteMCP, useUpdateMCP };
