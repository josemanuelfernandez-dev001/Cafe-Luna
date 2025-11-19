const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/roles.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/usuarios - Listar usuarios (Admin)
router.get('/', checkRole(['admin']), usuariosController.listarUsuarios);

// GET /api/usuarios/:id - Obtener usuario por ID (Admin)
router.get('/:id', checkRole(['admin']), usuariosController.obtenerUsuario);

// POST /api/usuarios - Crear usuario (Admin)
router.post('/', checkRole(['admin']), usuariosController.crearUsuario);

// PUT /api/usuarios/:id - Actualizar usuario (Admin)
router.put('/:id', checkRole(['admin']), usuariosController.actualizarUsuario);

// PATCH /api/usuarios/:id/password - Cambiar contraseña (Admin o mismo usuario)
router.patch('/:id/password', usuariosController.cambiarPassword);

// PATCH /api/usuarios/:id/desactivar - Desactivar/Activar usuario (Admin)
router.patch('/:id/desactivar', checkRole(['admin']), usuariosController.toggleActivarUsuario);

module.exports = router;
