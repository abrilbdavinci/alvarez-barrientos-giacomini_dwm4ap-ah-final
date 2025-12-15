// BackEnd/models/MarcaModel.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MarcaSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  origen: { type: String, trim: true, default: '' }
}, { timestamps: true });

export default model('Marca', MarcaSchema); // colección: marcas
