import api from "./api";

export const getBackpacks = async () => {
  try {
    const response = await api.get("/backpacks");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const getBackpack = async (id) => {
  try {
    const response = await api.get(`/backpacks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const createBackpack = async (backpackData) => {
  try {
    const response = await api.post("/backpacks", backpackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const updateBackpack = async (id, backpackData) => {
  try {
    const response = await api.put(`/backpacks/${id}`, backpackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const deleteBackpack = async (id) => {
  try {
    const response = await api.delete(`/backpacks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};
