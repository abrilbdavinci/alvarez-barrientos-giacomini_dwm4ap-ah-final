// middleware/auth.js
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'secret-demo';

function validarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      console.warn('[auth] falta Authorization header');
      return res.status(403).json({ msg: "Falta Authorization header (Bearer token)" });
    }

    const parts = String(authHeader).split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.warn('[auth] formato inválido Authorization:', authHeader);
      return res.status(403).json({ msg: "Formato de token inválido. Debe ser: Bearer <token>" });
    }

    const token = parts[1];
    try {
      const decoded = jwt.verify(token, SECRET);
      req.user = decoded;
      return next();
    } catch (verifyErr) {
      console.warn('[auth] jwt.verify error:', verifyErr && verifyErr.message);
      return res.status(401).json({ msg: "Token inválido o expirado", error: verifyErr.message });
    }
  } catch (err) {
    console.error("Error validarToken:", err);
    return res.status(500).json({ msg: "Error interno autenticación" });
  }
}

export default validarToken;
export { validarToken };
