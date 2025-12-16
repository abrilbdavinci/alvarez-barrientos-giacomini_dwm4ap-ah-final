// BackEnd/controllers/UsuarioController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UsuarioModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret-demo";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/* =========================
   REGISTRO
   POST /api/usuarios
========================= */
export const newUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      email,
      password: hash,
      rol: "free",
    });

    await user.save();

    res.status(201).json({
      msg: "Usuario registrado correctamente",
      data: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error newUser:", error);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
};

/* =========================
   LOGIN
   POST /api/usuarios/login
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      rol: user.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error loginUser:", error);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

/* =========================
   PERFIL
   GET /api/usuarios/perfil
========================= */
export const getPerfil = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(403).json({ msg: "Token requerido o inválido" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    return res.status(200).json({ data: user });
  } catch (err) {
    return next(err);
  }
};

/* =========================
   LISTAR USUARIOS
========================= */
export const listUsers = async (req, res, next) => {
  try {
    const usuarios = await User.find().select("-password");
    return res.status(200).json({ data: usuarios });
  } catch (err) {
    return next(err);
  }
};

/* =========================
   OBTENER USUARIO POR ID
========================= */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) return res.status(200).json({ data: user });
    return res.status(404).json({ msg: "Usuario no encontrado" });
  } catch (err) {
    return next(err);
  }
};

/* =========================
   ACTUALIZAR USUARIO
========================= */
export const updateUserById = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if ("password" in body) delete body.password;
    if (body.email) body.email = body.email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (user) return res.status(200).json({ msg: "Usuario actualizado", data: user });
    return res.status(404).json({ msg: "Usuario no encontrado" });
  } catch (err) {
    return next(err);
  }
};

/* =========================
   UPGRADE A PREMIUM
   POST /api/usuarios/upgrade
========================= */
export const upgradeToPremium = async (req, res) => {
  try {
    // req.user viene del middleware validarToken
    if (!req.user?.id) {
      return res.status(403).json({ msg: "Token requerido o inválido" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Cambiar rol a premium
    user.rol = "premium";
    await user.save();

    // Generar nuevo token con rol actualizado
    const payload = { id: user._id, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Responder con usuario actualizado y token
    res.json({
      msg: "Usuario actualizado a premium",
      data: user,
      token,
    });
  } catch (err) {
    console.error("Error upgradeToPremium:", err);
    res.status(500).json({ msg: "Error al actualizar a premium", error: err.message });
  }
};


/* =========================
   ELIMINAR USUARIO
========================= */
export const deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) return res.status(200).json({ msg: "Usuario eliminado" });
    return res.status(404).json({ msg: "Usuario no encontrado" });
  } catch (err) {
    return next(err);
  }
};
