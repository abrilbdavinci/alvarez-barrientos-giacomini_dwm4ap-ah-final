// src/components/Navbar.jsx
import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

export default function Navbar() {
  const { authStatus, logout, user: ctxUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // fallback: si el contexto no trae user, intentar parsear localStorage
  let user = ctxUser;
  if (!user) {
    try {
      const raw = localStorage.getItem("user");
      if (raw) user = JSON.parse(raw);
    } catch (e) {
      user = null;
    }
  }

  function handleLogout() {
    try {
      logout && logout();
    } catch (e) {
      // noop
    }
    // limpiar storage local
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
    } catch (e) {}
    navigate("/", { replace: true });
  }

  const displayName = (user && (user.nombre || user.name || user.email)) || null;

  return (
    <nav className="k-nav" role="navigation" aria-label="Main navigation">
      <div className="k-nav-inner">
        <div className="k-left">
          <Link to="/" className="k-brand">
            <div className="k-brand-title">Kälm</div>
            <div className="k-brand-sub">Bienestar y Rutinas</div>
          </Link>

          <div className="k-links">
            <NavLink to="/" end className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
              Inicio
            </NavLink>
            <NavLink to="/perfil" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
              Perfil
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
              Contacto
            </NavLink>
          </div>
        </div>

        <div className="k-actions">
          {authStatus === "ok" && displayName ? (
            <>
              <button
                className="k-btn k-btn-ghost k-user-btn"
                title="Mi perfil"
                onClick={() => navigate("/perfil")}
                aria-label="Ir a mi perfil"
              >
                <span className="k-user-name">{displayName}</span>
              </button>

              <button className="k-btn k-btn-primary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button className="k-btn k-btn-ghost" onClick={() => navigate("/registro")}>
                Crear cuenta
              </button>
              <button className="k-btn k-btn-primary" onClick={() => navigate("/login")}>
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
