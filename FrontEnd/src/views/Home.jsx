// src/views/Home.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import Card from "../components/Card";
import ListSimple from "../components/ListSimple";
import { AuthContext } from "../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Home() {
  const { token, user: ctxUser } = useContext(AuthContext);
  const rol = ctxUser?.rol; // free | premium | admin
  const isPremium = rol === "premium" || rol === "admin";

  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");

  // Responsive columns
  const [cols, setCols] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  });

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w >= 1024 && cols !== 3) setCols(3);
      else if (w >= 640 && w < 1024 && cols !== 2) setCols(2);
      else if (w < 640 && cols !== 1) setCols(1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cols]);

  // Cargar productos y marcas
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = token
          ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          : { "Content-Type": "application/json" };

        const [rProductos, rMarcas] = await Promise.all([
          fetch(`${API_BASE}/productos`, { headers, signal }),
          fetch(`${API_BASE}/marcas`, { headers, signal }),
        ]);

        if (!rProductos.ok || !rMarcas.ok) {
          const problematic = !rProductos.ok ? rProductos : rMarcas;
          const body = await problematic.json().catch(() => ({}));
          throw new Error(body.msg || body.error || "Error al cargar datos");
        }

        const productosData = await rProductos.json();
        const marcasData = await rMarcas.json();

        setProductos(Array.isArray(productosData.data) ? productosData.data : []);
        setMarcas(Array.isArray(marcasData.data) ? marcasData.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error cargando Home data:", err);
          setError(err.message || "Error al cargar datos");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [token, rol]);

  // Filtrado y orden
  const productosProcesados = useMemo(() => {
    let list = Array.isArray(productos) ? [...productos] : [];

    const q = (filter || "").trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const nombre = (p.nombre || "").toLowerCase();
        const tipo = (p.tipo || "").toLowerCase();
        const marcaNombre = p.marca?.nombre?.toLowerCase() || "";
        return nombre.includes(q) || tipo.includes(q) || marcaNombre.includes(q);
      });
    }

    if (tipoFilter) {
      const tf = tipoFilter.toLowerCase();
      list = list.filter((p) => (p.tipo || "").toLowerCase() === tf);
    }

    return list.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
  }, [productos, filter, tipoFilter]);

  // Limitar productos si el usuario es free
  const visibleProductos = useMemo(() => {
    return rol === "free" ? productosProcesados.slice(0, 4) : productosProcesados;
  }, [productosProcesados, rol]);

  return (
    <div className="app-root">
      {/* Header */}
      <header className="header-card">
        <div>
          <h2>Kälm — El cambio comienza en tu rutina.</h2>
          <p className="muted">Productos y marcas pensadas para tu rutina diaria.</p>
        </div>
        <div className="row">
          <input
            className="search-input"
            placeholder="Buscar por producto, tipo o marca..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="select-filter"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {[...new Set(productos.map((p) => p.tipo).filter(Boolean))].map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main */}
      <main className="kalm-main">
        <div className="row">
          {/* Productos */}
          <div className="col" style={{ flex: 1, position: "relative" }}>
            {error && (
              <div className="card" style={{ borderColor: "var(--kalm-danger)", color: "var(--kalm-danger)" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="skeleton-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : (
              <section className="productos-section" style={{ position: "relative" }}>
                <div className="mini muted">{`Productos recomendados (${productosProcesados.length})`}</div>

                {visibleProductos.length === 0 ? (
                  <div className="card">
                    <div className="muted">No hay productos que coincidan. Prueba otro filtro o búsqueda.</div>
                  </div>
                ) : (
                  <div
                    className="grid-3"
                    style={{ filter: !isPremium ? "blur(4px)" : "none", transition: "filter 0.3s" }}
                  >
                    {visibleProductos.map((p) => (
                      <Card
                        key={p._id || p.id}
                        id={p._id || p.id}
                        title={p.nombre}
                        subtitle={p.tipo}
                        image={p.foto}
                        meta={p.marca}
                      />
                    ))}
                  </div>
                )}

                {!isPremium && (
                  <div
                    className="overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      backgroundColor: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <h2>Contenido premium</h2>
                    <p>Actualiza tu cuenta para acceder a todos los productos.</p>
                    <a href="/premium" className="btn btn-primary">
                      Actualizar a Premium
                    </a>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="col" style={{ width: 300 }}>
            {marcas.length > 0 && (
              <div className="card">
                <h4>Lista de marcas</h4>
                <ListSimple
                  items={marcas}
                  renderItem={(m) => (
                    <div>
                      <strong>{m.nombre}</strong>
                      <div className="mini muted">{m.origen}</div>
                    </div>
                  )}
                />
              </div>
            )}

            <div className="card" style={{ marginTop: "auto" }}>
              <h4>Consejo Kälm</h4>
              <p className="mini muted">Respiración 4-6: 4s inhala — 6s exhala. Repetir 5 veces.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
