// src/views/admin/Marcas.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/marcas`);
        const data = await res.json();
        setMarcas(data.data || []);
      } catch (err) {
        console.error("Error cargando marcas", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Cargando marcas...</div>;
  if (!marcas.length) return <div>No hay marcas disponibles</div>;

  return (
    <div>
      <h2>Marcas</h2>
      <Link to="/admin/marcas/nuevo" className="btn">Nueva Marca</Link>
      <ul>
        {marcas.map((marca) => (
          <li key={marca._id}>
            <h3>{marca.nombre}</h3>
            <p>{marca.descripcion}</p>
            <Link to={`/admin/marcas/editar/${marca._id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
