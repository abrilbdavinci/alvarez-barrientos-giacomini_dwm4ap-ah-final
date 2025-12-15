// src/views/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-semibold mb-2">No encontrado</h2>
      <p className="text-gray-500 mb-4">La ruta solicitada no existe.</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded">Volver al inicio</Link>
    </div>
  );
}
