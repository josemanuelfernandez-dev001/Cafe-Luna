const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/roles.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/inventario - Listar inventario (legacy)
router.get('/', inventarioController.listarInventario);

// GET /api/inventario/insumos - Listar insumos
router.get('/insumos', inventarioController.listarInsumos);

// POST /api/inventario/insumos - Crear insumo (Admin, Barista)
router.post('/insumos',
  checkRole(['admin', 'barista']),
  inventarioController.crearInsumo
);

// POST /api/inventario/entradas - Registrar entrada (Admin, Barista)
router.post('/entradas',
  checkRole(['admin', 'barista']),
  inventarioController.registrarEntrada
);

// POST /api/inventario/salidas - Registrar salida (Admin, Barista)
router.post('/salidas',
  checkRole(['admin', 'barista']),
  inventarioController.registrarSalida
);

// GET /api/inventario/alertas - Ver alertas de stock bajo
router.get('/alertas', inventarioController.verAlertas);

// GET /api/inventario/movimientos - Listar movimientos
router.get('/movimientos', inventarioController.listarMovimientos);

// GET /api/inventario/:id - Obtener item por ID
router.get('/:id', inventarioController.obtenerItemInventario);

// PUT /api/inventario/:id - Actualizar inventario (Admin, Barista)
router.put('/:id', 
  checkRole(['admin', 'barista']),
  inventarioController.actualizarInventario
);

module.exports = router;
