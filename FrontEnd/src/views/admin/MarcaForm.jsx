// src/views/admin/MarcaForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function MarcaForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // editar si id existe
  const [marca, setMarca] = useState({ nombre: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !token) return;

    async function fetchMarca() {
      try {
        const res = await fetch(`${API_BASE}/marcas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo cargar la marca");
        const data = await res.json();
        setMarca(data.data || {});
      } catch (err) {
        setError(err.message);
      }
    }

    fetchMarca();
  }, [id, token]);

  const handleChange = (e) => setMarca({ ...marca, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const url = id ? `${API_BASE}/marcas/${id}` : `${API_BASE}/marcas`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(marca),
      });

      if (!res.ok) throw new Error("Error guardando marca");

      navigate("/admin/marcas");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>{id ? "Editar Marca" : "Nueva Marca"}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={marca.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
