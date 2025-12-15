// BackEnd/models/UsuarioModel.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UsuarioSchema = new Schema({
  nombre: { type: String, trim: true, default: '' },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

export default model('User', UsuarioSchema); // colección: users
