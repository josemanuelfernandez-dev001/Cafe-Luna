const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/roles.middleware');
const { validateCrearProducto } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/productos - Listar productos
router.get('/', productosController.listarProductos);

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', productosController.obtenerProducto);

// POST /api/productos - Crear producto (Solo Admin)
router.post('/', 
  checkRole(['admin']),
  validateCrearProducto,
  productosController.crearProducto
);

// PUT /api/productos/:id - Actualizar producto completo (Solo Admin)
router.put('/:id', 
  checkRole(['admin']),
  productosController.actualizarProducto
);

// PATCH /api/productos/:id - Actualizar producto parcial (Solo Admin)
router.patch('/:id', 
  checkRole(['admin']),
  productosController.actualizarProductoParcial
);

// DELETE /api/productos/:id - Eliminar producto (Solo Admin)
router.delete('/:id', 
  checkRole(['admin']),
  productosController.eliminarProducto
);

module.exports = router;
