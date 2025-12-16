import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

export default function Premium() {
  const { user, upgradeToPremium } = useContext(AuthContext);
  const isPremium = user?.rol === "premium" || user?.rol === "admin";

  const handleUpgrade = async () => {
    try {
      await upgradeToPremium(); // Debe existir en AuthContext
      alert("Ahora sos premium!");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar a premium");
    }
  };

  return (
    <div className="app-root">
      <h2>Sección Premium</h2>
      {!isPremium ? (
        <div>
          <p>Actualiza tu cuenta para acceder a todo el contenido premium.</p>
          <button className="k-btn k-btn-primary" onClick={handleUpgrade}>Actualizar a Premium</button>
        </div>
      ) : (
        <p>¡Bienvenido Premium! Ahora podés ver todo el contenido.</p>
      )}
    </div>
  );
}
