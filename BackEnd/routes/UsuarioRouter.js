// routes/UsuarioRouter.js
import express from "express";
import { body } from "express-validator";
import validarToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import User from "../models/UsuarioModel.js"; // tu modelo de MongoDB
import {
  newUser,
  loginUser,
  getPerfil,
  listUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  
} from "../controllers/UsuarioController.js";

const router = express.Router();

// =======================
// Rutas públicas
// =======================
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  loginUser
);

router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  newUser
);

// =======================
// Rutas protegidas (requieren token)
// =======================

// Obtener perfil del usuario autenticado
router.get("/perfil", validarToken, getPerfil);

// Listado de todos los usuarios (solo admin)
router.get("/", validarToken, checkRole(["admin"]), listUsers);



// Obtener usuario por ID
router.get("/:id", validarToken, getUserById);

// Actualizar usuario por ID
router.put("/:id", validarToken, updateUserById);

// Eliminar usuario por ID
router.delete("/:id", validarToken, checkRole(["admin"]), deleteUserById);

// =======================
// Rutas de rol
// =======================

// Cambiar rol de usuario (solo admin)
router.put("/:id/rol", validarToken, checkRole(["admin"]), async (req, res) => {
  try {
    const { rol } = req.body;
    if (!["admin", "premium", "free"].includes(rol)) {
      return res.status(400).json({ msg: "Rol inválido" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    ).select("-password");

    res.json({ msg: "Rol actualizado", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar rol" });
  }
});

// Hacer upgrade del usuario autenticado a premium
router.post("/upgrade", validarToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { rol: "premium" },
      { new: true }
    ).select("-password");

    res.json({ msg: "Ahora sos premium", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar usuario a premium" });
  }
});

export default router;
