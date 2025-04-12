import api from "./api";

export const getItems = async (backpackId) => {
  try {
    const response = await api.get(`/items/backpack/${backpackId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const getItem = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const createItem = async (backpackId, itemData) => {
  try {
    const response = await api.post(`/items/backpack/${backpackId}`, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const updateItem = async (id, itemData) => {
  try {
    const response = await api.put(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Ivyko klaida" };
  }
};
