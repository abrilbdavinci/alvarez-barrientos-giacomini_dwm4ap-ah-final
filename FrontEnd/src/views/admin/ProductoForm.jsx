// src/views/admin/ProductoForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function ProductoForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay id, estamos editando
  const [producto, setProducto] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return; // creación
    if (!token) return;

    async function fetchProducto() {
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo cargar el producto");
        const data = await res.json();
        setProducto(data.data || {});
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProducto();
  }, [id, token]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const url = id ? `${API_BASE}/productos/${id}` : `${API_BASE}/productos`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error("Error guardando producto");

      navigate("/admin/productos"); // redirigir al listado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>{id ? "Editar Producto" : "Nuevo Producto"}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
