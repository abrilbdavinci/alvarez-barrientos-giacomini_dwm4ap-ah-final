import Producto from '../models/ProductoModel.js'

const newProducto = async (req, res) => {
  try {
    const { nombre, marca, tipo, descripcion, tags, activos, formula, foto } = req.body;
    if (!marca) return res.status(400).json({ msg: "La marca es obligatoria" });

    const Marca = (await import('../models/MarcaModel.js')).default;
    const marcaObj = await Marca.findById(marca);
    if (!marcaObj) return res.status(404).json({ msg: "Marca no encontrada" });

    const producto = new Producto({ nombre, marca, tipo, descripcion, tags, activos, formula, foto });
    const data = await producto.save();
    res.status(201).json({ msg: "Producto creado", data });
  } catch (err) {
    res.status(500).json({ msg: "Error al crear producto", error: err.message });
  }
};


const listProductos = async (request, response) => {
    try {
        const { page = 1, limit = 10, nombre, marca } = request.query;
        const query = {};
        if (nombre) {
            query.nombre = { $regex: nombre, $options: 'i' };
        }
        if (marca) {
            query.marca = marca;
        }
        const productos = await Producto.find(query)
            .populate('marca')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = await Producto.countDocuments(query);
        response.json({ total, page: Number(page), limit: Number(limit), data: productos });
    } catch (err) {
        response.status(500).json({ msg: "Error al listar productos", error: err.message });
    }
};


const getProductoById = async (request, response) => {
    try {
        const id = request.params.id;
        const producto = await Producto.findById(id).populate('marca');
        if (producto) {
            response.status(200).json({ data: producto });
        } else {
            response.status(404).json({ msg: 'Producto no encontrado' });
        }
    } catch (err) {
        response.status(500).json({ msg: "Error al obtener producto", error: err.message });
    }
};


const deleteProductoById = async (request, response) => {
    try {
        const id = request.params.id;
        const producto = await Producto.findByIdAndDelete(id);
        if (producto) {
            response.status(200).json({ msg: 'Producto eliminado' });
        } else {
            response.status(404).json({ msg: 'Producto no encontrado' });
        }
    } catch (err) {
        response.status(500).json({ msg: "Error al eliminar producto", error: err.message });
    }
};


const updateProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (body.marca) {
      const Marca = (await import('../models/MarcaModel.js')).default;
      const marcaObj = await Marca.findById(body.marca);
      if (!marcaObj) return res.status(404).json({ msg: "Marca no encontrada" });
    }

    const producto = await Producto.findByIdAndUpdate(id, body, { new: true }).populate('marca');
    if (producto) res.status(200).json({ msg: "Producto actualizado", data: producto });
    else res.status(404).json({ msg: "Producto no encontrado" });
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar producto", error: err.message });
  }
};


const getProductoByNombre = async (request, response) => {
    try {
        const nombre = (request.params.nombre || '').trim().toLowerCase();
        if (!nombre) {
            return response.status(400).json({ msg: 'Nombre requerido' });
        }
        const productos = await Producto.find({
            nombre: { $regex: `^${nombre}$`, $options: 'i' }
        }).populate('marca');
        if (productos.length > 0) {
            response.status(200).json({ data: productos });
        } else {
            response.status(404).json({ msg: 'Producto no encontrado' });
        }
    } catch (err) {
        response.status(500).json({ msg: "Error al buscar producto", error: err.message });
    }
};

export { newProducto, listProductos, getProductoById, deleteProductoById, updateProductoById, getProductoByNombre };