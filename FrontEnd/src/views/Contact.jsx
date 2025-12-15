// src/views/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Gracias. Tu mensaje fue enviado");
    setForm({ nombre: "", email: "", mensaje: "" });
  }

  return (
    <div className="container" style={{ height: "90vh"}}>
      <h2 className="mb-4" style={{ margin: "28px auto"}}>
        Contacto — Kälm
      </h2>

      <div className="card" style={{ maxWidth: "1220px", margin: "0 auto" }}>
        <form className="form" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="input"
              placeholder="Tu nombre"
              required
            />
          </div>

          {/* Email */}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Mensaje */}
          <div className="field">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={6}
              value={form.mensaje}
              onChange={handleChange}
              className="input"
              placeholder="Escribe tu mensaje..."
              required
            />
          </div>

          {/* Botón */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
