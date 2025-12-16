import usuarioRouter from './UsuarioRouter.js';
import productoRouter from './ProductoRouter.js';
import marcaRouter from './MarcaRouter.js';
import adminRouter from './AdminRoutes.js';

const routerAPI = (app) => {
  console.log("[routerAPI] Cargando rutas públicas y protegidas");

  // Rutas públicas / semi públicas
  console.log("[routerAPI] Montando /api/users");
  app.use('/api/users', usuarioRouter);

  console.log("[routerAPI] Montando /api/productos");
  app.use('/api/productos', productoRouter);

  console.log("[routerAPI] Montando /api/marcas");
  app.use('/api/marcas', marcaRouter);

  // Rutas de admin (protegidas)
  console.log("[routerAPI] Montando /api/admin (protegidas)");
  app.use('/api/admin', adminRouter);

  console.log("[routerAPI] Todas las rutas cargadas correctamente");
}

export default routerAPI;
