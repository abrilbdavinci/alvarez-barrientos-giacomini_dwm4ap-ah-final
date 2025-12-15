import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  }

  function validateForm() {
    if (!form.email || !form.password) return "Por favor completá email y contraseña.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email inválido.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validateForm();
    if (v) return setError(v);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.msg || data?.error || (res.status === 401 ? "Credenciales inválidas" : "Error en el servidor");
        return setError(msg);
      }

      const token = data?.token || data?.accessToken;
      const user = data?.user || data?.data;

      if (!token) return setError("Respuesta inválida del servidor (falta token).");

      login(token, user || null);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1120, margin: "28px auto", padding: 16 }}>
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Iniciar sesión en Kälm</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          Bienvenido — ingresá tu cuenta para continuar.
        </p>

        {error && (
          <div
            role="alert"
            className="card"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.12)",
              color: "var(--kalm-danger)",
              marginBottom: 12,
              padding: 10,
            }}
          >
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} autoComplete="off" aria-live="polite">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 120 }}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <button type="button" className="btn btn-ghost" onClick={() => navigate("/registro")} style={{ minWidth: 120 }}>
              Crear cuenta
            </button>
          </div>
        </form>

        <div style={{ marginTop: 12 }} className="muted">
          <small>¿Olvidaste tu contraseña? Contactá al administrador del sistema.</small>
        </div>
      </div>
    </div>
  );
}
