// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Home from "./views/Home";
import Contact from "./views/Contact";
import Details from "./views/Details";
import Login from "./views/Login";
import Registro from "./views/Registro";
import NotFound from "./views/NotFound";
import Perfil from "./views/Perfil";
import PerfilEdit from "./views/PerfilEdit";
import Premium from "./views/Premium";

import AdminPanel from "./views/admin/Panel";
import AdminUsuarios from "./views/admin/Usuarios";
import AdminMarcas from "./views/admin/Marcas";
import AdminProductos from "./views/admin/Productos";
import ProductoCreate from "./views/admin/ProductoCreate";
import ProductoForm from "./views/admin/ProductoForm";
import MarcaCreate from "./views/admin/MarcaCreate";
import MarcaForm from "./views/admin/MarcaForm";

import { AuthProvider, AuthContext } from "./utils/AuthContext";
import Navbar from "./components/Navbar";

import "./index.css";

// =====================
// Rutas protegidas
// =====================
const ProtectedRoute = ({ children }) => {
  const { authStatus } = useContext(AuthContext);
  if (authStatus !== "ok") return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { authStatus, user } = useContext(AuthContext);
  if (authStatus !== "ok" || user?.rol !== "admin") return <Navigate to="/" replace />;
  return children;
};

const PremiumRoute = ({ children }) => {
  const { authStatus } = useContext(AuthContext);
  if (authStatus !== "ok") return <Navigate to="/login" replace />;
  return children;
};

// =====================
// Componente principal
// =====================
function App() {
  return (
    <div className="app-root" style={{ maxWidth: "1220px", margin: "0 auto" }}>
      <AuthProvider>
        <Navbar />

        <main className="kalm-main">
          <Routes>
            {/* ---------- PÚBLICAS ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* ---------- PREMIUM ---------- */}
            <Route
              path="/premium"
              element={
                <PremiumRoute>
                  <Premium />
                </PremiumRoute>
              }
            />

            {/* ---------- PERFIL ---------- */}
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil/editar"
              element={
                <ProtectedRoute>
                  <PerfilEdit />
                </ProtectedRoute>
              }
            />

            {/* ---------- ADMIN PANEL ---------- */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* Usuarios */}
            <Route
              path="/admin/usuarios"
              element={
                <AdminRoute>
                  <AdminUsuarios />
                </AdminRoute>
              }
            />

            {/* Productos */}
            <Route
              path="/admin/productos"
              element={
                <AdminRoute>
                  <AdminProductos />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/productos/nuevo"
              element={
                <AdminRoute>
                  <ProductoCreate />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/productos/editar/:id"
              element={
                <AdminRoute>
                  <ProductoForm />
                </AdminRoute>
              }
            />

            {/* Marcas */}
            <Route
              path="/admin/marcas"
              element={
                <AdminRoute>
                  <AdminMarcas />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/marcas/nuevo"
              element={
                <AdminRoute>
                  <MarcaCreate />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/marcas/editar/:id"
              element={
                <AdminRoute>
                  <MarcaForm />
                </AdminRoute>
              }
            />

            {/* ---------- FALLBACK 404 ---------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AuthProvider>

      <footer className="kalm-footer">
        <span>© 2025 Kälm · Bienestar y Rutinas</span>
      </footer>
    </div>
  );
}

export default App;
