// BackEnd/routes/admin.js
import express from "express";
import { validarToken } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";

// Usuarios
import {
  listUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  upgradeToPremium
} from "../controllers/UsuarioController.js";

// Productos
import {
  newProducto,
  listProductos,
  getProductoById,
  updateProductoById,
  deleteProductoById
} from "../controllers/ProductoController.js";

// Marcas
import {
  newMarca,
  listMarcas,
  getMarcaById,
  updateMarcaById,
  deleteMarcaById
} from "../controllers/MarcaController.js";

const router = express.Router();

// Middleware: solo admin
router.use(validarToken);
router.use(checkRole(["admin"]));

/* ==== USUARIOS ==== */
router.get("/usuarios", listUsers);
router.get("/usuarios/:id", getUserById);
router.put("/usuarios/:id", updateUserById);
router.delete("/usuarios/:id", deleteUserById);
router.post("/usuarios/:id/upgrade", upgradeToPremium);

/* ==== PRODUCTOS ==== */
router.get("/productos", listProductos);
router.get("/productos/:id", getProductoById);
router.post("/productos", newProducto);
router.put("/productos/:id", updateProductoById);
router.delete("/productos/:id", deleteProductoById);

/* ==== MARCAS ==== */
router.get("/marcas", listMarcas);
router.get("/marcas/:id", getMarcaById);
router.post("/marcas", newMarca);
router.put("/marcas/:id", updateMarcaById);
router.delete("/marcas/:id", deleteMarcaById);

export default router;
