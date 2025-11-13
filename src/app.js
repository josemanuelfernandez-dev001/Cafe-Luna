const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: false // Desactivar para desarrollo, ajustar en producción
}));
app.use(cors());

// Parser de body y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'cafe_luna_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000 // 8 horas
  }
}));

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const productosRoutes = require('./routes/productos.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const reportesRoutes = require('./routes/reportes.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Middleware para pasar información del usuario a las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rutas de vistas
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('login', { title: 'Iniciar Sesión - Café Luna' });
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { 
    title: 'Dashboard - Café Luna',
    user: req.session.user
  });
});

app.get('/pedidos/crear', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('pedidos/crear', { 
    title: 'Crear Pedido - Café Luna',
    user: req.session.user
  });
});

app.get('/pedidos/cola', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('pedidos/cola', { 
    title: 'Cola de Pedidos - Café Luna',
    user: req.session.user
  });
});

app.get('/productos', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('productos/lista', { 
    title: 'Productos - Café Luna',
    user: req.session.user
  });
});

app.get('/productos/nuevo', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.rol !== 'admin') {
    return res.status(403).render('error', { 
      title: 'Acceso Denegado',
      message: 'No tienes permisos para acceder a esta página',
      error: { status: 403 }
    });
  }
  res.render('productos/formulario', { 
    title: 'Nuevo Producto - Café Luna',
    user: req.session.user
  });
});

app.get('/inventario', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('inventario/lista', { 
    title: 'Inventario - Café Luna',
    user: req.session.user
  });
});

app.get('/reportes/ventas-diarias', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('reportes/ventas-diarias', { 
    title: 'Reporte de Ventas Diarias - Café Luna',
    user: req.session.user
  });
});

app.get('/usuarios', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.rol !== 'admin') {
    return res.status(403).render('error', { 
      title: 'Acceso Denegado',
      message: 'No tienes permisos para acceder a esta página',
      error: { status: 403 }
    });
  }
  res.render('usuarios/lista', { 
    title: 'Usuarios - Café Luna',
    user: req.session.user
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página No Encontrada',
    message: 'La página que buscas no existe',
    error: { status: 404 }
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message || 'Ha ocurrido un error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err : { status: err.status || 500 }
  });
});

module.exports = app;
