// BackEnd/config/dataBase.js (ejemplo)
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.URI_BD;
export async function connectDB(){
  await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log("Conectado a MongoDB");
  return mongoose.connection;
}
export default mongoose;
