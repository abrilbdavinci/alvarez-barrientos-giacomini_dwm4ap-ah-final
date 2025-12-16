// BackEnd/middleware/checkRole.js
export function checkRole(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ msg: "Rol no disponible" });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ msg: "No tienes permisos" });
    }

    next();
  };
}
