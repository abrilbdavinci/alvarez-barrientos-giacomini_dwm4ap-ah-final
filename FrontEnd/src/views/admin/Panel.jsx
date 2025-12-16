// src/views/admin/Panel.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]); // inicializamos como array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsuarios(res.data); // si tu API devuelve {data: [...]}, usa res.data.data
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.msg || "Error al cargar usuarios");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Panel Admin</h1>
      {usuarios.length === 0 ? (
        <p>No hay usuarios</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u._id}>
              {u.nombre} ({u.rol}) - {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
