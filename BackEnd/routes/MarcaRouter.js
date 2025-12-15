// BackEnd/routes/MarcaRouter.js
import express from 'express';
import {
  newMarca,
  listMarcas,
  getMarcaById,
  deleteMarcaById,
  updateMarcaById,
  getMarcaByNombre
} from '../controllers/MarcaController.js';

import validarToken from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', listMarcas);
router.get('/nombre/:nombre', getMarcaByNombre);
router.get('/:id', getMarcaById);

// Rutas protegidas
router.post('/', validarToken, newMarca);
router.put('/:id', validarToken, updateMarcaById);
router.delete('/:id', validarToken, deleteMarcaById);

export default router;
