import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { clearUser, loadUser, saveUser, validateLogin } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser());

  const login = useCallback((payload) => {
    const result = validateLogin(payload);
    if (!result.ok) return result;
    saveUser(result.user);
    setUser(result.user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
