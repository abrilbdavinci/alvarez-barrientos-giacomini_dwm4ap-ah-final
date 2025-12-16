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
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

// Públicas
router.get("/", validarToken, listProductos);
router.get('/nombre/:nombre', getProductoByNombre);
router.get('/:id', getProductoById);
router.get("/productos", validarToken, listProductos); // obligatorio token para saber rol
router.get("/productos/:id", validarToken, getProductoById);


// Protegidas
router.post("/", validarToken, checkRole(["admin"]), newProducto);
router.put("/:id", validarToken, checkRole(["admin"]), updateProductoById);
router.delete("/:id", validarToken, checkRole(["admin"]), deleteProductoById);


export default router;
