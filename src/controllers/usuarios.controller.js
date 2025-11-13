const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * Listar usuarios
 */
const listarUsuarios = async (req, res) => {
  try {
    const { rol, activo } = req.query;

    let query = supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, created_at, updated_at')
      .order('nombre', { ascending: true });

    if (rol) {
      query = query.eq('rol', rol);
    }

    if (activo !== undefined) {
      query = query.eq('activo', activo === 'true');
    }

    const { data: usuarios, error } = await query;

    if (error) {
      console.error('Error al listar usuarios:', error);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }

    res.json({ usuarios });

  } catch (error) {
    console.error('Error en listarUsuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

/**
 * Obtener usuario por ID
 */
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario });

  } catch (error) {
    console.error('Error en obtenerUsuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

/**
 * Crear usuario (Solo Admin)
 */
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el email ya existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({
        nombre,
        email,
        password_hash,
        rol: rol || 'barista',
        activo: true
      })
      .select('id, nombre, email, rol, activo, created_at')
      .single();

    if (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: 'Error al crear usuario' });
    }

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario
    });

  } catch (error) {
    console.error('Error en crearUsuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

/**
 * Actualizar usuario (Solo Admin)
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, activo, password } = req.body;

    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (email !== undefined) updateData.email = email;
    if (rol !== undefined) updateData.rol = rol;
    if (activo !== undefined) updateData.activo = activo;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    updateData.updated_at = new Date().toISOString();

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select('id, nombre, email, rol, activo, updated_at')
      .single();

    if (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario
    });

  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario
};
