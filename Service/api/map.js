import api from "../Interceptor/apiClient";


export const getMaps = async () => {
  const response = await api.get("/api/maps");
  return response.data;
};