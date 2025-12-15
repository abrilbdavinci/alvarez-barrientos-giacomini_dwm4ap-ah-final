// BackEnd/controllers/MarcaController.js
import Marca from '../models/MarcaModel.js';

/**
 * Crear nueva marca
 */
const newMarca = async (request, response) => {
  try {
    const { nombre, origen } = request.body;
    const marca = new Marca({ nombre, origen });
    const data = await marca.save();
    return response.status(201).json({ msg: 'Marca creada', data });
  } catch (error) {
    console.error('newMarca error:', error);
    return response.status(500).json({ msg: 'Error del servidor' });
  }
};

/**
 * Listar marcas con paginación y filtro por nombre (query: ?page=1&limit=10&nombre=xx)
 */
const listMarcas = async (request, response) => {
  try {
    const { page = 1, limit = 10, nombre } = request.query;
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);

    const query = {};
    if (nombre) {
      // búsqueda parcial case-insensitive
      query.nombre = { $regex: nombre, $options: 'i' };
    }

    const [total, marcas] = await Promise.all([
      Marca.countDocuments(query),
      Marca.find(query)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean()
    ]);

    return response.json({
      total,
      page: pageNum,
      limit: limitNum,
      data: marcas
    });
  } catch (error) {
    console.error('listMarcas error:', error);
    return response.status(500).json({ msg: 'Error del servidor' });
  }
};

/**
 * Obtener marca por id
 */
const getMarcaById = async (request, response) => {
  try {
    const { id } = request.params;
    const marca = await Marca.findById(id).lean();
    if (marca) {
      return response.status(200).json({ data: marca });
    } else {
      return response.status(404).json({ msg: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error('getMarcaById error:', error);
    return response.status(500).json({ msg: 'Error del servidor' });
  }
};

/**
 * Eliminar marca por id
 */
const deleteMarcaById = async (request, response) => {
  try {
    const { id } = request.params;
    const marca = await Marca.findByIdAndDelete(id);
    if (marca) {
      return response.status(200).json({ msg: 'Marca eliminada' });
    } else {
      return response.status(404).json({ msg: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error('deleteMarcaById error:', error);
    return response.status(500).json({ msg: 'Error del servidor' });
  }
};

/**
 * Actualizar marca por id
 */
const updateMarcaById = async (request, response) => {
  try {
    const { id } = request.params;
    const body = request.body;
    const marca = await Marca.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (marca) {
      return response.status(200).json({ msg: 'Marca actualizada', data: marca });
    } else {
      return response.status(404).json({ msg: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error('updateMarcaById error:', error);
    return response.status(500).json({ msg: 'Error del servidor' });
  }
};

/**
 * Buscar marca(s) por nombre exacto (case-insensitive) en params
 */
const getMarcaByNombre = async (request, response) => {
  try {
    const nombre = (request.params.nombre || '').trim();
    if (!nombre) {
      return response.status(400).json({ msg: 'Nombre requerido' });
    }
    const marcas = await Marca.find({ nombre: { $regex: `^${nombre}$`, $options: 'i' } }).lean();
    if (marcas.length > 0) {
      return response.status(200).json({ data: marcas });
    } else {
      return response.status(404).json({ msg: 'Marca no encontrada' });
    }
  } catch (error) {
    console.error('getMarcaByNombre error:', error);
    return response.status(500).json({ msg: 'Error del servidor' });
  }
};

export { newMarca, listMarcas, getMarcaById, deleteMarcaById, updateMarcaById, getMarcaByNombre };
