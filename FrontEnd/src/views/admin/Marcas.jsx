// src/views/admin/Marcas.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Marcas() {
  const { token } = useContext(AuthContext);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarcas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/marcas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cargando marcas");
      const data = await res.json();
      setMarcas(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchMarcas();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta marca?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/marcas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar marca");
      setMarcas(marcas.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la marca");
    }
  };

  if (loading) return <p>Cargando marcas...</p>;

  return (
    <div className="admin-page">
      <h2>Marcas</h2>
      <Link to="/admin/marcas/nuevo" className="btn">Nueva Marca</Link>
      <ul>
        {marcas.map((m) => (
          <li key={m._id} className="card p-2 flex justify-between items-center">
            <div>
              <strong>{m.nombre}</strong>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/marcas/editar/${m._id}`} className="btn btn-primary">Editar</Link>
              <button onClick={() => handleDelete(m._id)} className="btn btn-secondary">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
