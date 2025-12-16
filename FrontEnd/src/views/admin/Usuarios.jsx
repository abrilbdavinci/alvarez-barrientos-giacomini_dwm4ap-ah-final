// src/views/admin/Usuarios.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";

export default function AdminUsuarios() {
  const { token } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsuarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando usuario");
      fetchUsuarios(); // recargar lista
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUsuarios();
  }, [token]);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-page">
      <h2>Usuarios del sistema</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios</p>
      ) : (
        <div className="list-users">
          {usuarios.map((u) => (
            <div key={u._id} className="card p-2 flex justify-between items-center">
              <div>
                <strong>{u.nombre}</strong> • {u.email} • Rol: {u.rol}
              </div>
              <button
                onClick={() => handleDelete(u._id)}
                className="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
