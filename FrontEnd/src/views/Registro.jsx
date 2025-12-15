// src/views/Registro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Registro() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  }

  function validateForm() {
    if (!form.nombre || !form.email || !form.password) return "Todos los campos son obligatorios.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email inválido.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validateForm();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.msg || data?.error || "Error en registro";
        setError(msg);
        return;
      }

      // registro ok -> redirigir a login
      navigate("/login");
      // opcional: informar con alert
      setTimeout(() => window.alert("Registro exitoso. Inicia sesión."), 50);
    } catch (err) {
      setError(err.message || "Error en registro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1120, margin: "28px auto", padding: 16 }}>
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Registro en Kälm</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          Creá tu cuenta para comenzar a usar las rutinas y gestionar productos.
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
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="input"
              autoComplete="name"
              required
              aria-required="true"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              autoComplete="username"
              required
              aria-required="true"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              autoComplete="new-password"
              required
              aria-required="true"
            />
            <div className="muted mini" style={{ marginTop: 6 }}>
              Mínimo 6 caracteres.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 140 }}>
              {loading ? "Registrando..." : "Registrarme"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/login")} style={{ minWidth: 120 }}>
              Ir a Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
