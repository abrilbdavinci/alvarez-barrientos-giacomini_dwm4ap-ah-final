// BackEnd/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Importar routers
import usuarioRouter from "./routes/UsuarioRouter.js";
import productoRouter from "./routes/ProductoRouter.js";
import marcaRouter from "./routes/MarcaRouter.js";
import postRouter from "./routes/PostRouter.js";
import adminRouter from "./routes/AdminRoutes.js";

// Importar conexión a DB
import { connectDB } from "./config/dataBase.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:5173";

/* -------------------------
   Middlewares globales
------------------------- */
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Asegurar que las preflight OPTIONS respondan correctamente
app.options("*", cors({ origin: FRONTEND_URL, credentials: true }));

// Parseo de body JSON y URL-encoded
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------------
   Ruta raíz
------------------------- */
app.get("/", (req, res) => {
  res.json({ msg: "API BackEnd - alive" });
});

/* -------------------------
   Rutas de la API
------------------------- */
app.use("/api/usuarios", usuarioRouter);
app.use("/api/productos", productoRouter);
app.use("/api/marcas", marcaRouter);
app.use("/api/posts", postRouter);
app.use("/api/admin", adminRouter);

/* -------------------------
   Middleware de manejo de errores
------------------------- */
app.use((err, req, res, next) => {
  console.error("Error handler:", err);

  let status = err.status || 500;
  let message = err.message || "Error interno del servidor";

  if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  }
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

/* -------------------------
   Conexión a DB y arranque de servidor
------------------------- */
let server;

async function startServer() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("Fallo al conectar a la base de datos:", err);
    process.exit(1);
  }
}

/* -------------------------
   Manejo de cierre de servidor y DB
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
      if (mongoose.connection && mongoose.connection.readyState) {
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

/* -------------------------
   Start
------------------------- */
startServer();
