// src/components/Form.jsx
import React, { useState, useEffect } from "react";

export default function Form({ fields = [], onSubmit, submitLabel = "Enviar" }) {
  const initial = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default || "" }), {});
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fields)]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (typeof onSubmit === "function") await onSubmit(form);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {fields.map((f) => (
        <div key={f.name} className="field">
          <label htmlFor={f.name}>{f.label}</label>

          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              value={form[f.name] || ""}
              onChange={handleChange}
              className="input"
            />
          ) : f.type === "select" ? (
            <select
              id={f.name}
              name={f.name}
              value={form[f.name] || ""}
              onChange={handleChange}
              className="input"
            >
              <option value="">{f.placeholder || "Seleccionar..."}</option>
              {Array.isArray(f.options) &&
                f.options.map((opt) => {
                  const val = opt.value || opt._id || opt;
                  const label = opt.label || opt.nombre || opt;
                  return (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  );
                })}
            </select>
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type || "text"}
              value={form[f.name] || ""}
              onChange={handleChange}
              className="input"
            />
          )}
        </div>
      ))}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
