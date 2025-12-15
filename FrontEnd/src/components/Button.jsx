// src/components/Button.jsx
import React from "react";

export default function Button({
  text,
  color = "default",
  handleClick,
  type = "button",
  className = "",
}) {
  const variants = {
    default: "btn",
    primary: "btn btn-primary",
    ghost: "btn btn-ghost",
    outline: "btn btn-outline",
    red: "btn btn-danger",
  };

  const cls = `${variants[color] || variants.default} ${className}`;

  return (
    <button type={type} onClick={handleClick} className={cls}>
      {text}
    </button>
  );
}
