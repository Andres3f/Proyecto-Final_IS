import api from "./api";
import axios from "axios";
import type { TokenResponse, UserResponse } from "../types/auth";

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return fallback;
};

export const login = async (email: string, password: string): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  const response = await api.post<TokenResponse>("/api/v1/auth/login", formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

export const register = async (email: string, fullName: string, password: string): Promise<UserResponse> => {
  const response = await api.post<UserResponse>("/api/v1/auth/register", {
    email,
    full_name: fullName,
    password,
  });
  return response.data;
};

export const fetchProfile = async () => {
  const response = await api.get<UserResponse>("/api/v1/users/me");
  return response.data;
};
