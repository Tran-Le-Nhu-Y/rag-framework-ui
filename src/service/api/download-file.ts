const downloadFile = (downloadToken: string) => {
  return `${import.meta.env.VITE_API_GATEWAY}/download?token=${downloadToken}`;
};
export { downloadFile };
