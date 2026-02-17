import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export const api = {
  // Создание нового товара
  createProduct: async (product) => {
    const response = await apiClient.post("/products", product);
    return response.data;
  },

  // Получение всех товаров
  getProducts: async () => {
    const response = await apiClient.get("/products");
    return response.data;
  },

  // Получение товара по ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Обновление товара (PATCH)
  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data;
  },

  // Удаление товара
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
