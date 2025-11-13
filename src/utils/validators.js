const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validadores para login
 */
const validateLogin = [
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

/**
 * Validadores para crear pedido
 */
const validateCrearPedido = [
  body('tipo')
    .notEmpty().withMessage('El tipo de pedido es requerido')
    .isIn(['mostrador', 'uber_eats', 'rappi', 'didi_food']).withMessage('Tipo de pedido inválido'),
  body('items')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('items.*.producto_id')
    .notEmpty().withMessage('El ID del producto es requerido')
    .isUUID().withMessage('ID de producto inválido'),
  body('items.*.cantidad')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
  handleValidationErrors
];

/**
 * Validadores para actualizar estado
 */
const validateActualizarEstado = [
  param('id')
    .isUUID().withMessage('ID de pedido inválido'),
  body('estado')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'])
    .withMessage('Estado inválido'),
  handleValidationErrors
];

/**
 * Validadores para crear producto
 */
const validateCrearProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('categoria')
    .notEmpty().withMessage('La categoría es requerida')
    .isIn(['bebida_caliente', 'bebida_fria', 'alimento', 'postre', 'snack'])
    .withMessage('Categoría inválida'),
  body('precio')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  body('disponible')
    .optional()
    .isBoolean().withMessage('El campo disponible debe ser booleano'),
  handleValidationErrors
];

/**
 * Validadores para reporte de ventas
 */
const validateReporteVentas = [
  query('fecha')
    .notEmpty().withMessage('La fecha es requerida')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateCrearPedido,
  validateActualizarEstado,
  validateCrearProducto,
  validateReporteVentas
};
