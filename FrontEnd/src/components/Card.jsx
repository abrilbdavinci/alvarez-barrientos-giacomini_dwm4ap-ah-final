// src/components/Card.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function Card({ id, title, subtitle, image, meta }) {
  return (
    <article className="card">
      {/* Media */}
      <div className="card-media">
        <img src={image || "/placeholder.png"} alt={title} />
      </div>

      {/* Body */}
      <div className="card-body">
        <h4>{title}</h4>
        {subtitle && <div className="subtitle">{subtitle}</div>}
        {meta && (
          <div className="meta">
            {typeof meta === "object" ? meta.nombre || meta.name : meta}
          </div>
        )}

        {/* Actions */}
        <div className="card-actions">
          <Link to={`/details/${id}`} className="inline-block">
            <Button text="Ver" color="outline" className="text-sm" />
          </Link>
        </div>
      </div>
    </article>
  );
}
