// src/App.jsx

import { Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import Contact from "./views/Contact";
import Details from "./views/Details";
import Login from "./views/Login";
import Registro from "./views/Registro";
import NotFound from "./views/NotFound";
import Perfil from "./views/Perfil";
import PerfilEdit from "./views/PerfilEdit";
import "./index.css";
import { PrivateRoute } from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app-root">
      <AuthProvider>
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={ 
              <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              }
            />
            <Route path="/perfil/editar" element={
              <PrivateRoute>
                <PerfilEdit />
              </PrivateRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
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
