import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { AuthContext } from "../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function PerfilEdit() {
  const { token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userLocal, setUserLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/usuarios/perfil`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate("/login", { replace: true });
            return;
          }
          throw new Error(res.statusText || "Error cargando perfil");
        }
        const d = await res.json();
        if (mounted) setUserLocal(d.data || d || null);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [token, navigate]);

  async function handleSubmit(values) {
    const userId = userLocal?.id || userLocal?._id;
    if (!token || !userId) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg || b.error || res.statusText);
      }
      const d = await res.json();
      const updated = d.data || d;

      setUserLocal(updated);
      setUser(updated); // <--- actualiza contexto -> Navbar se actualiza

      alert("Perfil actualizado");
      navigate("/perfil", { replace: true });
    } catch (err) {
      console.error("update profile", err);
      alert(err.message || "Error actualizando perfil");
    }
  }

  if (!token) return <div className="card">Inicia sesión para editar tu perfil.</div>;
  if (loading) return <div className="card">Cargando...</div>;
  if (error) return <div className="card" style={{ color: "red" }}>{error}</div>;
  if (!userLocal) return <div className="card">Usuario no encontrado.</div>;

  return (
    <div className="page-root" style={{ maxWidth: 720, margin: "12px auto", padding: 16 }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Editar perfil</h3>
        <Form
          className="form"
          fields={[
            { name: "nombre", label: "Nombre", default: userLocal.nombre || "" },
            { name: "email", label: "Email", default: userLocal.email || "" },
            { name: "password", label: "Nueva contraseña", default: "" },
          ]}
          submitLabel="Guardar cambios"
          submitClassName="btn btn-primary"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
