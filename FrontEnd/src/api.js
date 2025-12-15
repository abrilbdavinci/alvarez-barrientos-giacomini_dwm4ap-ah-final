// src/api.js
// Centraliza las llamadas a la API del backend

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const msg = data?.msg || data?.error || res.statusText;
    throw new Error(msg);
  }
  return data;
}

// Ejemplo de uso:
// import { apiFetch } from "../api";
// const productos = await apiFetch("/productos");
