import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

function getCreatedAtFrom(obj) {
  if (!obj) return null;
  return obj.createdAt || obj.created_at || obj.created || obj.fechaCreacion || null;
}

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
  const { token: contextToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [token, setToken] = useState(contextToken || null);
  const [usuarios, setUsuarios] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugMsg, setDebugMsg] = useState("");

  useEffect(() => {
    if (contextToken && contextToken !== token) setToken(contextToken);
  }, [contextToken, token]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData(endpoint, setter) {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          signal,
        });

        if (res.status === 401 || res.status === 403) {
          logout?.();
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json().catch(() => null);
        setter(data?.data || data || []);
      } catch (err) {
        if (err.name !== "AbortError") console.warn(`Fetch ${endpoint} error:`, err);
      }
    }

    setLoading(true);
    fetchData("/usuarios/perfil", setMe);
    fetchData("/usuarios", setUsuarios).finally(() => setLoading(false));

    return () => controller.abort();
  }, [token, logout, navigate]);

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
              {me ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <div><strong>Nombre</strong></div>
                  <div className="muted">{me.nombre || me.name || "—"}</div>
                  <div style={{ marginTop: 8 }}><strong>Email</strong></div>
                  <div className="muted">{me.email || "—"}</div>
                </div>
              ) : (
                <div className="muted">No disponible</div>
              )}
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Mis rutinas</h3>
              <div className="muted">Las rutinas personales se guardan desde la versión completa del producto.</div>
            </div>
          </div>

          <aside>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Usuarios del sistema</h3>
              {usuarios.length === 0 ? (
                <div className="muted">Sin usuarios o no tienes permisos</div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {usuarios.map((u) => (
                    <div key={u._id || u.email} style={{ padding: 8, borderBottom: "1px solid var(--kalm-border)" }}>
                      <div style={{ fontWeight: 700 }}>{u.nombre || "—"}</div>
                      <div className="mini muted">{u.email || "—"}</div>
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
