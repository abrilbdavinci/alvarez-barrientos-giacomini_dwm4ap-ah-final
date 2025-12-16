import Producto from "../models/ProductoModel.js";

// Crear producto
const newProducto = async (req, res) => {
  try {
    console.log("[newProducto] body:", req.body);
    const { nombre, marca, tipo, descripcion, tags, activos, formula, foto } = req.body;

    if (!marca) return res.status(400).json({ msg: "Marca obligatoria" });

    const Marca = (await import("../models/MarcaModel.js")).default;
    const marcaObj = await Marca.findById(marca);
    if (!marcaObj) return res.status(404).json({ msg: "Marca no encontrada" });

    const producto = new Producto({ nombre, marca, tipo, descripcion, tags, activos, formula, foto });
    const data = await producto.save();

    console.log("[newProducto] creado:", data._id);
    res.status(201).json({ msg: "Producto creado", data });
  } catch (err) {
    console.error("[newProducto] error:", err.message);
    res.status(500).json({ msg: "Error al crear producto", error: err.message });
  }
};

// Listar productos según rol
const listProductos = async (req, res) => {
  try {
    console.log("[listProductos] req.user:", req.user);
    const rol = req.user?.rol || "free";
    console.log("[listProductos] rol calculado:", rol);

    let query = Producto.find().populate("marca");

    if (rol === "free") {
      console.log("[listProductos] limitando a 4 productos para free");
      query = query.limit(4);
    }

    const productos = await query;
    console.log(`[listProductos] productos encontrados: ${productos.length}`);
    res.json({ data: productos, rol });
  } catch (err) {
    console.error("[listProductos] error:", err.message);
    res.status(500).json({ msg: "Error productos", error: err.message });
  }
};

// Obtener producto por ID
const getProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("[getProductoById] id:", id);

    const producto = await Producto.findById(id).populate("marca");
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    res.status(200).json({ data: producto });
  } catch (err) {
    console.error("[getProductoById] error:", err.message);
    res.status(500).json({ msg: "Error al obtener producto", error: err.message });
  }
};

// Eliminar producto
const deleteProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("[deleteProductoById] id:", id);

    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    res.status(200).json({ msg: "Producto eliminado" });
  } catch (err) {
    console.error("[deleteProductoById] error:", err.message);
    res.status(500).json({ msg: "Error al eliminar producto", error: err.message });
  }
};

// Actualizar producto
const updateProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    console.log("[updateProductoById] id:", id, "body:", body);

    if (body.marca) {
      const Marca = (await import("../models/MarcaModel.js")).default;
      const marcaObj = await Marca.findById(body.marca);
      if (!marcaObj) return res.status(404).json({ msg: "Marca no encontrada" });
    }

    const producto = await Producto.findByIdAndUpdate(id, body, { new: true }).populate("marca");
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    console.log("[updateProductoById] actualizado:", producto._id);
    res.status(200).json({ msg: "Producto actualizado", data: producto });
  } catch (err) {
    console.error("[updateProductoById] error:", err.message);
    res.status(500).json({ msg: "Error al actualizar producto", error: err.message });
  }
};

// Buscar producto por nombre exacto
const getProductoByNombre = async (req, res) => {
  try {
    const nombre = (req.params.nombre || "").trim().toLowerCase();
    console.log("[getProductoByNombre] nombre:", nombre);
    if (!nombre) return res.status(400).json({ msg: "Nombre requerido" });

    const productos = await Producto.find({
      nombre: { $regex: `^${nombre}$`, $options: "i" },
    }).populate("marca");

    if (!productos.length) return res.status(404).json({ msg: "Producto no encontrado" });

    console.log("[getProductoByNombre] encontrados:", productos.length);
    res.status(200).json({ data: productos });
  } catch (err) {
    console.error("[getProductoByNombre] error:", err.message);
    res.status(500).json({ msg: "Error al buscar producto", error: err.message });
  }
};

export {
  newProducto,
  listProductos,
  getProductoById,
  deleteProductoById,
  updateProductoById,
  getProductoByNombre,
};
