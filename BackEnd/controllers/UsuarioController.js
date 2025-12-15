// BackEnd/controllers/UsuarioController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/UsuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-demo';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Crear nuevo usuario (contraseña encriptada)
 * POST /api/usuarios
 */
const newUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre = '', email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ msg: 'Email y password requeridos' });

    const emailNorm = String(email).toLowerCase().trim();

    // Evitar duplicados
    const existing = await User.findOne({ email: emailNorm });
    if (existing) return res.status(409).json({ msg: 'El email ya está registrado' });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = new User({
      nombre: nombre || '',
      email: emailNorm,
      password: hashedPassword,
    });

    const data = await usuario.save();

    // No devolver password en la respuesta
    const { password: _p, ...safe } = data.toObject();
    return res.status(201).json({ msg: 'Usuario creado', data: safe });
  } catch (err) {
    // dejar que el error pase al error handler global
    return next(err);
  }
};

/**
 * Login de usuario
 * POST /api/usuarios/login
 */
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ msg: 'Email y password requeridos' });

    const emailNorm = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: emailNorm });
    if (!user) return res.status(401).json({ msg: 'Credenciales inválidas' });

    // Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Credenciales inválidas' });

    // Generar token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const userSafe = {
      id: user._id,
      email: user.email,
      nombre: user.nombre || null,
    };

    return res.status(200).json({ msg: 'Login ok', token, user: userSafe });
  } catch (err) {
    return next(err);
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/usuarios/perfil
 * Requiere middleware validarToken que ponga req.user (id/email)
 */
const getPerfil = async (req, res, next) => {
  try {
    // req.user debe venir del middleware validarToken
    const userFromToken = req.user;
    if (!userFromToken || !userFromToken.id) {
      return res.status(403).json({ msg: 'Token requerido o inválido' });
    }

    const user = await User.findById(userFromToken.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    return res.status(200).json({ data: user });
  } catch (err) {
    return next(err);
  }
};

/**
 * Listar todos los usuarios
 * GET /api/usuarios
 */
const listUsers = async (req, res, next) => {
  try {
    const usuarios = await User.find().select('-password');
    return res.status(200).json({ data: usuarios });
  } catch (err) {
    return next(err);
  }
};

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) return res.status(200).json({ data: user });
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  } catch (err) {
    return next(err);
  }
};

/**
 * Eliminar usuario por ID
 * DELETE /api/usuarios/:id
 */
const deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) return res.status(200).json({ msg: 'Usuario eliminado' });
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  } catch (err) {
    return next(err);
  }
};

/**
 * Actualizar usuario por ID (sin modificar password)
 * PUT /api/usuarios/:id
 */
const updateUserById = async (req, res, next) => {
  try {
    const body = { ...req.body };
    // No permitir actualizar password directamente por este endpoint
    if ('password' in body) delete body.password;

    // Normalizar email si se intenta actualizar
    if (body.email) body.email = String(body.email).toLowerCase().trim();

    const user = await User.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (user) return res.status(200).json({ msg: 'Usuario actualizado', data: user });
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  } catch (err) {
    return next(err);
  }
};

/**
 * Buscar usuario(s) por nombre (case-insensitive)
 * GET /api/usuarios/nombre/:nombre
 */
const getUserByNombre = async (req, res, next) => {
  try {
    const nombre = (req.params.nombre || '').trim();
    if (!nombre) return res.status(400).json({ msg: 'Nombre requerido' });

    const usuarios = await User.find({
      nombre: { $regex: `^${nombre}$`, $options: 'i' },
    }).select('-password');

    if (usuarios.length > 0) return res.status(200).json({ data: usuarios });
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  } catch (err) {
    return next(err);
  }
};

export {
  newUser,
  loginUser,
  getPerfil,
  listUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getUserByNombre,
};
