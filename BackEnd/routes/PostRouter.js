import express from "express";
import validarToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/PostController.js";

const router = express.Router();

/* =========================
   RUTAS PÚBLICAS
   ========================= */
router.get("/", getPosts);
router.get("/:id", getPostById);

/* =========================
   RUTAS PROTEGIDAS
   ========================= */

// Crear post (admin y premium)
router.post(
  "/",
  validarToken,
  checkRole(["admin", "premium"]),
  createPost
);

// Editar post (admin o autor – controlado en el controller)
router.put(
  "/:id",
  validarToken,
  checkRole(["admin", "premium"]),
  updatePost
);

// Eliminar post (solo admin)
router.delete(
  "/:id",
  validarToken,
  checkRole(["admin"]),
  deletePost
);

export default router;
