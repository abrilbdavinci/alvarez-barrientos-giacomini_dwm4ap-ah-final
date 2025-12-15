// routes/UsuarioRouter.js (ejemplo)
import express from 'express';
import { body } from 'express-validator';
import validarToken from '../middleware/auth.js';
import {
  newUser,
  loginUser,
  getPerfil,
  listUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getUserByNombre,
} from '../controllers/UsuarioController.js';

const router = express.Router();

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], loginUser);

router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], newUser);

// rutas protegidas
router.get('/perfil', validarToken, getPerfil);
router.get('/', validarToken, listUsers);
router.get('/nombre/:nombre', validarToken, getUserByNombre);
router.get('/:id', validarToken, getUserById);
router.put('/:id', validarToken, updateUserById);
router.delete('/:id', validarToken, deleteUserById);

export default router;
