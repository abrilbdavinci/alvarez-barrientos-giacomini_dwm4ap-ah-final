// BackEnd/models/ProductoModel.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ProductoSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  marca: { type: Schema.Types.ObjectId, ref: 'Marca', required: true },
  tipo: { type: String, trim: true, default: '' },
  descripcion: { type: String, trim: true, default: '' },
  tags: [{ type: String, trim: true }],
  activos: { type: String, trim: true, default: '' },
  formula: { type: String, trim: true, default: '' },
  foto: { type: String, trim: true, default: "/placeholder.png" } // URL o path de la imagen
}, { timestamps: true });

export default model('Producto', ProductoSchema);
