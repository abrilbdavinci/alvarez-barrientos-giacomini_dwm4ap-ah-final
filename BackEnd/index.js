// BackEnd/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/dataBase.js";
import usuarioRouter from "./routes/UsuarioRouter.js";
import productoRouter from "./routes/ProductoRouter.js";
import marcaRouter from "./routes/MarcaRouter.js";
import postRouter from "./routes/PostRouter.js";


const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
const PORT = Number(process.env.PORT) || 3000;



/* -------------------------
   Middlewares globales
   ------------------------- */
// Habilitar CORS sólo para el frontend en desarrollo
app.use(
  cors({
    origin: corsOrigin, // origen exacto (no usar '*' si usás cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

// Asegurar que las preflight OPTIONS respondan correctamente
app.options(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------------
   Ruta raíz simple
   ------------------------- */
app.get("/", (req, res) => {
  res.json({ msg: "API BackEnd - alive" });
});

/* -------------------------
   Iniciar servidor sólo después de conectar DB
   ------------------------- */
let server;

async function startServer() {
  try {
    await connectDB();

    app.use("/api/usuarios", usuarioRouter);
    app.use("/api/productos", productoRouter);
    app.use("/api/marcas", marcaRouter);
    app.use("/api/posts", postRouter);

    // Error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      console.error("Error handler:", err);

      // Middleware de manejo de errores global mejorado
      let status = err.status || 500;
      let message = err.message || "Error interno del servidor";
      // Si es error de validación de mongoose
      if (err.name === "ValidationError") {
        status = 400;
        message = err.message;
      }
      // Si es error de objeto no encontrado
      if (err.name === "CastError") {
        status = 404;
        message = "Recurso no encontrado";
      }
      res.status(status).json({ error: message });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ msg: "Endpoint no encontrado" });
    });

    server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("Fallo al conectar a la base de datos (startServer):", err);
    process.exit(1);
  }
}

/* -------------------------
   Manejo de señales y errores globales
   ------------------------- */
async function shutdownHandler(signal) {
  console.log(`\nRecibida señal ${signal}. Cerrando servidor...`);
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      console.log("Servidor cerrado.");
    }
    try {
      const mongoose = await import("mongoose");
      if (mongoose && mongoose.connection && mongoose.connection.readyState) {
        await mongoose.disconnect();
        console.log("Desconectado de MongoDB.");
      }
    } catch (e) {
      // noop
    }
    process.exit(0);
  } catch (err) {
    console.error("Error al cerrar servidor:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdownHandler("SIGINT"));
process.on("SIGTERM", () => shutdownHandler("SIGTERM"));

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  shutdownHandler("uncaughtException");
});

startServer();
