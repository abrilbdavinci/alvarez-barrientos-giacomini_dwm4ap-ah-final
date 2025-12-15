// src/components/ListSimple.jsx
import React from "react";

/**
 * ListSimple
 * Props:
 *  - title (string) opcional
 *  - items (array) elementos (cada uno puede tener _id, id, nombre, email, createdAt)
 *  - onDelete (fn) recibe id
 *  - renderItem (fn) recibe item y debe devolver nodo JSX
 */
export default function ListSimple({ title = "", items = [], onDelete, renderItem }) {
  const formatDate = (d) => {
    if (!d) return null;
    try {
      const date = new Date(d);
      if (isNaN(date)) return d;
      return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  const avatar = (name) => {
    const n = (name || "").toString().trim();
    const initials = n ? n.split(/\s+/).slice(0, 2).map(s => s[0].toUpperCase()).join("") : "?";
    return (
      <div
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--kalm-primary-weak)",
          color: "white",
          fontWeight: 700,
          marginRight: 10,
          flex: "0 0 36px",
        }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="card bg-surface shadow-kalm" role="list" aria-label={title || "Lista simple"}>
      {title ? <h4 style={{ marginBottom: 12 }}>{title}</h4> : null}

      {items.length === 0 ? (
        <div className="muted" style={{ padding: "12px 0" }}>No hay elementos</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => {
            const id = it._id || it.id || it.email || JSON.stringify(it);
            const nombre = it.nombre || it.name || it.email || "Sin nombre";
            const fecha = it.createdAt || it.created_at || it.fechaCreacion || it.created || null;
            const fechaFmt = formatDate(fecha);

            return (
              <div
                key={id}
                role="listitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--kalm-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  {avatar(nombre)}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--kalm-text)" }}>{renderItem ? renderItem(it) : nombre}</div>
                    <div className="mini muted" style={{ marginTop: 2 }}>
                      {it.email ? it.email : null}
                      {fechaFmt ? (it.email ? " • " : "") + fechaFmt : null}
                    </div>
                  </div>
                </div>

                {onDelete ? (
                  <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        // confirmación ligera
                        if (window.confirm("Confirmar eliminación")) onDelete(id);
                      }}
                      aria-label={`Eliminar ${nombre}`}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
