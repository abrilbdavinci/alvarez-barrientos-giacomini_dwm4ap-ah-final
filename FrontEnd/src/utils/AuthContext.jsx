import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [token, setToken] = useState(storedToken ? storedToken.replace(/"/g, "") : null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const authStatus = token && user ? "ok" : "logout";

  const login = (newToken, newUser) => {
    const t = newToken.replace(/"/g, "");
    setToken(t);
    setUser(newUser || null);
    localStorage.setItem("token", t);
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    function syncStorage() {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      setToken(t ? t.replace(/"/g, "") : null);
      setUser(u ? JSON.parse(u) : null);
    }
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
