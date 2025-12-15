// BackEnd/routes/PostRouter.js
import express from "express";
import validarToken from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error GET /api/posts:", error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.json(post);
  } catch (error) {
    console.error("Error GET /api/posts/:id", error);
    res.status(500).json({ error: "Error al obtener el post" });
  }
});

router.post("/", validarToken, async (req, res) => {
  try {
    const { titulo, contenido, categoria } = req.body;
    if (!titulo || !contenido) return res.status(400).json({ error: "Faltan campos obligatorios" });

    const nuevoPost = new Post({
      titulo,
      contenido,
      categoria: categoria || "general",
      autor: req.user?.id || req.user?._id || null
    });

    const guardado = await nuevoPost.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error POST /api/posts:", error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

router.put("/:id", validarToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    const userId = req.user?.id || req.user?._id;
    if (post.autor && userId && post.autor.toString() !== userId.toString()) {
      return res.status(403).json({ error: "No tienes permiso para editar" });
    }

    const actualizado = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    console.error("Error PUT /api/posts/:id", error);
    res.status(500).json({ error: "Error al actualizar el post" });
  }
});

router.delete("/:id", validarToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    const userId = req.user?.id || req.user?._id;
    if (post.autor && userId && post.autor.toString() !== userId.toString()) {
      return res.status(403).json({ error: "No tienes permiso para eliminar" });
    }

    await post.deleteOne();
    res.json({ message: "Post eliminado" });
  } catch (error) {
    console.error("Error DELETE /api/posts/:id", error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});

export default router;
