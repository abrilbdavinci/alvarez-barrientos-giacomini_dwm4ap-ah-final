// BackEnd/routes/ProductoRouter.js
import express from 'express';
import {
  newProducto,
  listProductos,
  getProductoById,
  deleteProductoById,
  updateProductoById,
  getProductoByNombre
} from '../controllers/ProductoController.js';
import validarToken from '../middleware/auth.js';

const router = express.Router();

// Públicas
router.get('/', listProductos);
router.get('/nombre/:nombre', getProductoByNombre);
router.get('/:id', getProductoById);

// Protegidas
router.post('/', validarToken, newProducto);
router.put('/:id', validarToken, updateProductoById);
router.delete('/:id', validarToken, deleteProductoById);

export default router;
