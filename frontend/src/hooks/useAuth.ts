import { useState } from "react";
import { login as loginService, register as registerService } from "../services/auth";
import { setToken, getToken, removeToken } from "../lib/storage";

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(getToken());

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    setToken(response.access_token);
    setTokenState(response.access_token);
  };

  const register = async (email: string, fullName: string, password: string) => {
    return registerService(email, fullName, password);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return { token, login, logout, register };
}
