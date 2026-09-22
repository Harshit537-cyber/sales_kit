import api from "../Interceptor/apiClient";


export const getDosDonts = async () => {
  try {
    const response = await api.get("/api/dos-donts");
    return response.data;
  } catch (error) {
    console.error("Error fetching Do's and Don'ts:", error);
    throw error;
  }
};
