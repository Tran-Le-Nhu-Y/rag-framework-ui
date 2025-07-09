import { createAxiosInstance } from '../../util';

export const ragFrameworkInstance = createAxiosInstance({
  baseURL: `${import.meta.env.VITE_API_GATEWAY}`,
});
