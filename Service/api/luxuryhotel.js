import api from "../Interceptor/apiClient";

export const getHotelNames = async () => {
  const response = await api.get("/api/hotels/names");
  return response.data;
};

export const getHotelById = async (id) => {
  const response = await api.get(`/api/hotels/${id}`);
  return response.data;
};