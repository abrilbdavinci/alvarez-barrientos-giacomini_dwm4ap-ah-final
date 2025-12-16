// src/pages/Perfil.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

function formatDateSafe(value) {
  if (!value) return "N/A";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

export default function Perfil() {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.rol === "admin";

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchUsers() {
      if (!isAdmin) return setUsuarios([]); // solo admins pueden ver usuarios
      try {
        const res = await fetch(`${API_BASE}/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (res.status === 401 || res.status === 403) {
          logout?.();
          navigate("/login", { replace: true });
          return;
        }
        const data = await res.json();
        setUsuarios(data?.data || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error("No se pudo obtener usuarios:", err);
      }
    }

    setLoading(true);
    fetchUsers().finally(() => setLoading(false));

    return () => controller.abort();
  }, [token, logout, navigate, isAdmin]);

  return (
    <div className="page-root" style={{ maxWidth: 1080, margin: "12px auto", padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Mi perfil</h2>

      {loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          <div className="card" style={{ height: 60 }} />
          <div className="card" style={{ height: 140 }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          <div>
            <div className="card">
              {user ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <div><strong>Nombre</strong></div>
                  <div className="muted">{user.nombre || user.name || "—"}</div>
                  <div style={{ marginTop: 8 }}><strong>Email</strong></div>
                  <div className="muted">{user.email || "—"}</div>
                  <div style={{ marginTop: 8 }}><strong>Rol</strong></div>
                  <div className="muted">{user.rol || "—"}</div>

                  <div style={{ marginTop: 12 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/perfil/editar")}
                    >
                      Editar perfil
                    </button>
                  </div>
                </div>
              ) : (
                <div className="muted">No disponible</div>
              )}
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Mis rutinas</h3>
              <div className="muted">
                Las rutinas personales se guardan desde la versión completa del producto.
              </div>
            </div>
          </div>

          <aside>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Usuarios del sistema</h3>
              {!isAdmin ? (
                <div className="muted">No tienes permisos para ver otros usuarios</div>
              ) : usuarios.length === 0 ? (
                <div className="muted">Sin usuarios</div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {usuarios.map((u) => (
                    <div
                      key={u._id || u.email}
                      style={{ padding: 8, borderBottom: "1px solid var(--kalm-border)" }}
                    >
                      <div style={{ fontWeight: 700 }}>{u.nombre || "—"}</div>
                      <div className="mini muted">{u.email || "—"}</div>
                      <div className="mini muted">Rol: {u.rol || "—"}</div>
                      <div className="mini muted">Creado: {formatDateSafe(u.createdAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
