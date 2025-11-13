const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/roles.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/inventario - Listar inventario
router.get('/', inventarioController.listarInventario);

// GET /api/inventario/:id - Obtener item por ID
router.get('/:id', inventarioController.obtenerItemInventario);

// PUT /api/inventario/:id - Actualizar inventario (Admin, Barista)
router.put('/:id', 
  checkRole(['admin', 'barista']),
  inventarioController.actualizarInventario
);

module.exports = router;
