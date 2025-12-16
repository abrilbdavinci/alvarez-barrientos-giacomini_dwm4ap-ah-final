// src/components/Navbar.jsx
import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

export default function Navbar() {
  const { authStatus, logout, user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const rol = user?.rol; // free | premium | admin
  const displayName = user?.nombre || user?.name || user?.email || null;

  const handleLogout = () => {
    logout?.();
    setUser?.(null);
    setToken?.(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) => `k-link ${isActive ? "k-link-active" : ""}`;

  return (
    <nav className="k-nav" role="navigation" aria-label="Main navigation">
      <div className="k-nav-inner">
        {/* IZQUIERDA */}
        <div className="k-left">
          <div className="k-brand">
            <div className="k-brand-title">Kälm</div>
            <div className="k-brand-sub">Bienestar y Rutinas</div>
          </div>

          <div className="k-links">
            {authStatus === "ok" && (
              <>
                <NavLink to="/" end className={linkClass}>Inicio</NavLink>
                <NavLink to="/contact" className={linkClass}>Contacto</NavLink>
                <NavLink to="/perfil" className={linkClass}>Perfil</NavLink>

                {/* Premium */}
                {rol === "free" && <NavLink to="/premium" className="k-link k-link-highlight">⭐ Hacerse Premium</NavLink>}
                {rol === "premium" && <NavLink to="/premium" className={linkClass}>Premium</NavLink>}

                {/* Admin */}
                {rol === "admin" && (
                  <>
                    <NavLink to="/admin/usuarios" className={linkClass}>Usuarios</NavLink>
                    <NavLink to="/admin/marcas" className={linkClass}>Marcas</NavLink>
                    <NavLink to="/admin/productos" className={linkClass}>Productos</NavLink>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* DERECHA */}
        <div className="k-actions">
          {authStatus === "ok" && displayName ? (
            <>
              <span className={`k-badge ${rol}`}>
                {rol === "admin" && "ADMIN"}
                {rol === "premium" && "PREMIUM"}
                {rol === "free" && "FREE"}
              </span>

              <NavLink
                to="/perfil"
                className="k-btn k-btn-ghost k-user-btn"
                aria-label="Ir a mi perfil"
              >
                <span className="k-user-name">{displayName}</span>
              </NavLink>

              <button className="k-btn k-btn-primary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button className="k-btn k-btn-ghost" onClick={() => navigate("/registro")}>Crear cuenta</button>
              <button className="k-btn k-btn-primary" onClick={() => navigate("/login")}>Iniciar sesión</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
