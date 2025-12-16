import Post from "../models/Post.js";

/*
  GET /api/posts
  Público (o autenticado, no obligatorio)
*/
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("autor", "nombre email rol")
      .sort({ createdAt: -1 });

    res.json({ data: posts });
  } catch (error) {
    console.error("Error getPosts:", error);
    res.status(500).json({ msg: "Error al obtener los posts" });
  }
};

/*
  GET /api/posts/:id
*/
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("autor", "nombre email rol");

    if (!post) {
      return res.status(404).json({ msg: "Post no encontrado" });
    }

    res.json({ data: post });
  } catch (error) {
    console.error("Error getPostById:", error);
    res.status(500).json({ msg: "Error al obtener el post" });
  }
};

/*
  POST /api/posts
  Admin y Premium
*/
export const createPost = async (req, res) => {
  try {
    const { titulo, contenido, categoria } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({ msg: "Título y contenido son obligatorios" });
    }

    const nuevoPost = new Post({
      titulo,
      contenido,
      categoria: categoria || "general",
      autor: req.user.id, // viene del JWT
    });

    const postGuardado = await nuevoPost.save();

    res.status(201).json({
      msg: "Post creado correctamente",
      data: postGuardado,
    });
  } catch (error) {
    console.error("Error createPost:", error);
    res.status(500).json({ msg: "Error al crear el post" });
  }
};

/*
  PUT /api/posts/:id
  Admin o autor del post
*/
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post no encontrado" });
    }

    // Admin puede editar todo, premium solo si es autor
    if (
      req.user.rol !== "admin" &&
      post.autor.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "No tienes permisos para editar este post" });
    }

    const actualizado = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      msg: "Post actualizado",
      data: actualizado,
    });
  } catch (error) {
    console.error("Error updatePost:", error);
    res.status(500).json({ msg: "Error al actualizar el post" });
  }
};

/*
  DELETE /api/posts/:id
  Solo admin
*/
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post no encontrado" });
    }

    await post.deleteOne();

    res.json({ msg: "Post eliminado correctamente" });
  } catch (error) {
    console.error("Error deletePost:", error);
    res.status(500).json({ msg: "Error al eliminar el post" });
  }
};
