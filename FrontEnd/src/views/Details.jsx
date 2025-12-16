// src/views/Details.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);
  const rol = user?.rol;

  // Cargar producto
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          headers: { 
            "Content-Type": "application/json", 
            Authorization: token ? `Bearer ${token}` : "" 
          },
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw e;
        }
        const j = await res.json();
        setItem(j.data || j);
      } catch (err) {
        console.error("Error detalle:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, token]);

  // Función para eliminar producto
  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "" 
        },
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw e;
      }
      alert("Producto eliminado correctamente");
      navigate("/admin/productos");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el producto");
    }
  };

  // Función para editar producto
  const handleEdit = () => {
    navigate(`/admin/productos/editar/${id}`);
  };

  if (loading) return <div className="card p-4">Cargando...</div>;
  if (!item) return <div className="card p-4">Elemento no encontrado</div>;

  return (
    <div className="container">
      <div className="card p-4">
        {/* Título */}
        <h2>{item.nombre}</h2>

        {/* Marca y tipo */}
        <div className="meta" style={{ marginBottom: "12px" }}>
          {(item.marca?.nombre || item.marca) + " • " + item.tipo}
        </div>

        {/* Imagen */}
        {item.foto && (
          <div className="card-media" style={{ marginBottom: "16px", textAlign: "center" }}>
            <img 
              src={item.foto} 
              alt={item.nombre} 
              style={{ width: "auto", height: "500px", maxWidth: "100%", borderRadius: "8px" }} 
            />
          </div>
        )}

        {/* Descripción */}
        {item.descripcion && <p style={{ marginBottom: "16px", color: "var(--kalm-text)" }}>{item.descripcion}</p>}

        {/* Activos principales */}
        <h4 style={{ fontWeight: 600, marginBottom: "6px" }}>Activos principales</h4>
        <p style={{ marginBottom: "16px", color: "var(--kalm-text)" }}>{item.activos || "No especificado"}</p>

        {/* Recomendación */}
        <h4 style={{ fontWeight: 600, marginBottom: "6px" }}>Recomendación de uso</h4>
        <p style={{ color: "var(--kalm-muted)" }}>Usar según indicaciones. Consulta a un especialista en caso de duda.</p>

        {/* Botones CRUD solo para admin */}
        {rol === "admin" && (
          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            <button className="k-btn k-btn-primary" onClick={handleEdit}>Editar</button>
            <button className="k-btn k-btn-danger" onClick={handleDelete}>Eliminar</button>
          </div>
        )}
      </div>
    </div>
  );
}
