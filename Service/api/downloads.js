import api from "../Interceptor/apiClient";

export const getDownloads = async () => {
  const response = await api.get("/api/downloads");
  return response.data;
};

export const downloadCategoryZip = async (id) => {
  const response = await api.get(`/api/downloads/${id}/zip`, {
    responseType: "blob",
  });
  return response.data;
};