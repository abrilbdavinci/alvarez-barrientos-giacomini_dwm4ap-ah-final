// src/views/Home.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import Card from "../components/Card";
import ListSimple from "../components/ListSimple";
import Form from "../components/Form";
import { AuthContext } from "../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";
const PAGE_SIZE_DEFAULT = 8;

export default function Home() {
  const { token } = useContext(AuthContext);

  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [sortKey, setSortKey] = useState("nombre");
  const [page] = useState(1);
  const [pageSize] = useState(PAGE_SIZE_DEFAULT);

  const [cols, setCols] = useState(() => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  });

  // responsive columns
  useEffect(() => {
    function onResize() {
      const w = window.innerWidth;
      if (w >= 1024 && cols !== 3) setCols(3);
      else if (w >= 640 && w < 1024 && cols !== 2) setCols(2);
      else if (w < 640 && cols !== 1) setCols(1);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cols]);

  const authHeaders = React.useCallback(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // fetch productos y marcas
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [rProductos, rMarcas] = await Promise.all([
          fetch(`${API_BASE}/productos`, { headers: { "Content-Type": "application/json", ...authHeaders() }, signal }),
          fetch(`${API_BASE}/marcas`, { headers: { "Content-Type": "application/json", ...authHeaders() }, signal }),
        ]);

        if (!rProductos.ok || !rMarcas.ok) {
          const problematic = !rProductos.ok ? rProductos : rMarcas;
          const body = await problematic.json().catch(() => ({}));
          throw new Error(body.msg || body.error || "Error al cargar datos");
        }

        const productosData = await rProductos.json();
        const marcasData = await rMarcas.json();

        setProductos(Array.isArray(productosData) ? productosData : productosData.data || []);
        setMarcas(Array.isArray(marcasData) ? marcasData : marcasData.data || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error cargando Home data:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
    return () => controller.abort();
  }, [token, authHeaders]);

  // crear marca
  async function createMarca(body) {
    try {
      if (!body.nombre || body.nombre.trim().length < 2) {
        alert("Nombre de marca inválido");
        return;
      }
      const res = await fetch(`${API_BASE}/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg || b.error || res.statusText);
      }
      const d = await res.json();
      const nueva = d.data || d || body;
      setMarcas((m) => [nueva, ...m]);
      alert("Marca creada correctamente");
    } catch (err) {
      console.error("createMarca", err);
      alert(err.message || "Error creando marca");
    }
  }

  // eliminar marca
  async function deleteMarca(id) {
    if (!window.confirm("¿Eliminar marca? Esta acción es irreversible.")) return;
    try {
      const res = await fetch(`${API_BASE}/marcas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders() },
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg || b.error || res.statusText);
      }
      setMarcas((m) => m.filter((x) => (x._id || x.id) !== id));
      alert("Marca eliminada");
    } catch (err) {
      console.error("deleteMarca", err);
      alert(err.message || "Error eliminando marca");
    }
  }

  // productos filtrados y ordenados
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

    // sort
    return list.sort((a, b) => {
      if (sortKey === "nombre") return (a.nombre || "").localeCompare(b.nombre || "");
      if (sortKey === "tipo") return (a.tipo || "").localeCompare(b.tipo || "");
      if (sortKey === "precio") return (a.precio || 0) - (b.precio || 0);
      return 0;
    });
  }, [productos, filter, tipoFilter, sortKey]);

  const totalItems = productosProcesados.length;
  const startIndex = (page - 1) * pageSize;
  const pagedProductos = productosProcesados.slice(startIndex, startIndex + pageSize);

  const productsGridStyle = { display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: "1rem" };

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar arriba */}
      <header className="header-card" role="banner" style={{ marginBottom: 16 }}>
        <div>
          <h2>Kälm — El cambio comienza en tu rutina.</h2>
          <p className="muted">Productos y marcas pensadas para tu rutina diaria.</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            className="search-input"
            placeholder="Buscar por producto, tipo o marca..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="select-filter"
            value={tipoFilter}
            onChange={(e) => {
              setTipoFilter(e.target.value);
            }}
          >
            <option value="">Todos los tipos</option>
            {[...new Set(productos.map((p) => p.tipo).filter(Boolean))].map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Contenido principal + sidebar */}
      <div style={{ display: "flex", flex: 1, gap: 16 }}>
        {/* Main */}
        <main style={{ flex: 1 }}>
          {error && <div className="card" style={{ background: "#fff5f5", borderColor: "#fed7d7", color: "#b91c1c" }}>{error}</div>}

          {loading ? (
            <div className="skeleton-grid">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : (
            <section style={{ marginBottom: 12 }}>
              <div className="mini muted" style={{ marginBottom: 8 }}>
                {`Productos recomendados (${totalItems})`}
              </div>
              {pagedProductos.length === 0 ? (
                <div className="card">
                  <div className="muted">No hay productos que coincidan. Prueba otro filtro o búsqueda.</div>
                </div>
              ) : (
                <div className="card" style={{ padding: 12 }}>
                  <div style={productsGridStyle}>
                    {pagedProductos.map((p) => (
                      <Card key={p._id || p.id} id={p._id || p.id} title={p.nombre} subtitle={p.tipo} image={p.foto} meta={p.marca} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <h4 style={{ marginBottom: 8 }}>Marcas</h4>
            <div style={{ marginTop: 6 }}>
              <h4 style={{ marginBottom: 8 }}>Crear marca</h4>
              <Form
                className="form"
                fields={[
                  { name: "nombre", label: "Nombre", default: "" },
                  { name: "origen", label: "Origen / nota", default: "" },
                ]}
                submitLabel="Crear marca"
                submitClassName="btn btn-primary"
                onSubmit={createMarca}
              />
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: 8 }}>Lista de marcas</h4>
            <ListSimple
              items={marcas}
              onDelete={deleteMarca}
              renderItem={(m) => (
                <div>
                  <strong>{m.nombre}</strong>
                  <div className="mini muted">{m.origen}</div>
                </div>
              )}
            />
          </div>

          <div className="card" style={{ marginTop: "auto" }}>
            <h4>Consejo Kälm</h4>
            <p className="mini muted">Respiración 4-6: 4s inhala — 6s exhala. Repetir 5 veces.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
