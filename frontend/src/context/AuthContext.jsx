import { createContext, useContext, useEffect, useState } from "react";
import { api, TOKEN_STORAGE_KEY } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  );

  useEffect(() => {
    let active = true;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .me()
      .then((res) => {
        if (active) setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (active) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = async (username, password) => {
    const res = await api.login({ username, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (username, password, displayName) => {
    const res = await api.register({
      username,
      password,
      display_name: displayName,
    });
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
