const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/roles.middleware');
const { validateCrearPedido, validateActualizarEstado } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/pedidos - Listar pedidos
router.get('/', pedidosController.listarPedidos);

// GET /api/pedidos/:id - Obtener pedido por ID
router.get('/:id', pedidosController.obtenerPedido);

// POST /api/pedidos - Crear pedido (Admin, Barista)
router.post('/', 
  checkRole(['admin', 'barista']),
  validateCrearPedido, 
  pedidosController.crearPedido
);

// PATCH /api/pedidos/:id/estado - Actualizar estado (Admin, Barista, Cocina)
router.patch('/:id/estado', 
  checkRole(['admin', 'barista', 'cocina']),
  validateActualizarEstado,
  pedidosController.actualizarEstado
);

module.exports = router;
