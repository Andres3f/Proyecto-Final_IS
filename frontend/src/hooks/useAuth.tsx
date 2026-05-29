import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginService, register as registerService } from "../services/auth";
import { setToken, getToken, removeToken } from "../lib/storage";
import type { UserResponse } from "../types/auth";

type AuthContextValue = {
  token: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, fullName: string, password: string) => Promise<UserResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const login = async (email: string, password: string, remember = false) => {
    const response = await loginService(email, password);
    setToken(response.access_token, remember);
    setTokenState(response.access_token);
  };

  const register = async (email: string, fullName: string, password: string) => {
    return registerService(email, fullName, password);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
