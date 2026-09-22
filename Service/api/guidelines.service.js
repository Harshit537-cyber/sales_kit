import api from "../Interceptor/apiClient";

export const createGuidelines = async (formData) => {
  const response = await api.post("/api/guidelines", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllGuidelines = async () => {
  const response = await api.get("/api/guidelines");
  return response.data;
};

export const getGuidelinesById = async (id) => {
  const response = await api.get(`/api/guidelines/${id}`);
  return response.data;
};

export const downloadSingleFile = async (id, fileId) => {
  const response = await api.get(`/api/guidelines/${id}/files/${fileId}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadGuidelinesZip = async (id) => {
  const response = await api.get(`/api/guidelines/${id}/zip`, {
    responseType: "blob",
  });
  return response.data;
};

export const deleteGuidelines = async (id) => {
  const response = await api.delete(`/api/guidelines/${id}`);
  return response.data;
};