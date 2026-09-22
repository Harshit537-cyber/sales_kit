import api from "../Interceptor/apiClient";

export const getImageBank = async () => {
  const response = await api.get("/api/image-bank");
  return response.data;
};

export const downloadAllImages = async () => {
  const response = await api.get("/api/image-bank/download-all", {
    timeout: 0,
  });
  return response.data;
};