import axios from "axios";
import { getToken, removeToken } from "../lib/storage";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: /^https?:\/\//.test(apiUrl) ? apiUrl : `https://${apiUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
