const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateReporteVentas } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/reportes/ventas-diarias
router.get('/ventas-diarias', 
  validateReporteVentas,
  reportesController.ventasDiarias
);

// GET /api/reportes/ventas-periodo
router.get('/ventas-periodo', 
  reportesController.ventasPorPeriodo
);

module.exports = router;
