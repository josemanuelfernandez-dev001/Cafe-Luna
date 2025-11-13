const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/roles.middleware');

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware);
router.use(checkRole(['admin']));

// GET /api/usuarios - Listar usuarios
router.get('/', usuariosController.listarUsuarios);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', usuariosController.obtenerUsuario);

// POST /api/usuarios - Crear usuario
router.post('/', usuariosController.crearUsuario);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', usuariosController.actualizarUsuario);

module.exports = router;
