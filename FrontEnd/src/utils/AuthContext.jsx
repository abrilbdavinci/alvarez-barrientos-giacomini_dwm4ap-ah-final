// src/utils/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const authStatus = token ? "ok" : "guest";

  // login: guarda token y usuario
  function login(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  // logout: limpia todo
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // refrescar usuario desde backend
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo actualizar el usuario");
      const data = await res.json();
      if (data.data) {
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
      }
    } catch (err) {
      console.error("Error refrescando usuario:", err);
    }
  }, [token]);

  // upgrade a premium
  const upgradeToPremium = async () => {
  if (!token) throw new Error("No hay token");

  const res = await fetch(`${API_BASE}/usuarios/upgrade`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error al actualizar a premium");

  const data = await res.json();

  // Guardar usuario y token actualizado
  setUser(data.data);
  localStorage.setItem("user", JSON.stringify(data.data));
  localStorage.setItem("token", data.token);
};


  // refrescar usuario al montar la app
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authStatus,
        login,
        logout,
        refreshUser,
        setUser,
        upgradeToPremium, // 🔹 ahora sí lo exportamos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
