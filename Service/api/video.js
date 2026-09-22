import api from "../Interceptor/apiClient";

export const getVideos = async () => {
  const response = await api.get("/api/videos", {
    timeout: 60000, // 60 seconds tak wait karega Render wake up hone ka
  });
  return response.data;
};