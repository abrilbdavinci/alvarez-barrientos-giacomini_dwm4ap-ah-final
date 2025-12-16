// src/views/admin/Productos.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Productos() {
  const { token } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/productos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cargando productos");
      const data = await res.json();
      setProductos(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchProductos();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      setProductos(productos.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el producto");
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="admin-page">
      <h2>Productos</h2>
      <Link to="/admin/productos/nuevo" className="btn">Nuevo Producto</Link>
      <ul>
        {productos.map((p) => (
          <li key={p._id} className="card p-2 flex justify-between items-center">
            <div>
              <strong>{p.nombre}</strong> • {p.descripcion}
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/productos/editar/${p._id}`} className="btn btn-primary">Editar</Link>
              <button onClick={() => handleDelete(p._id)} className="btn btn-secondary">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
