import api from "../Interceptor/apiClient";

export const getDestinationSummary = async (params) => {
  const response = await api.get("/api/destinations/summary", { params });
  return response.data;
};

export const getDestinationNames = async () => {
  const response = await api.get("/api/destinations/names");
  return response.data;
};

export const getDestinationById = async (id) => {
  const response = await api.get(`/api/destinations/${id}`);
  return response.data;
};