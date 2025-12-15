import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    categoria: { type: String, default: "general" },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
