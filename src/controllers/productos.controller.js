const supabase = require('../config/supabase');

/**
 * Listar todos los productos
 */
const listarProductos = async (req, res) => {
  try {
    const { categoria, disponible, busqueda } = req.query;

    let query = supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    if (disponible !== undefined) {
      query = query.eq('disponible', disponible === 'true');
    }

    if (busqueda) {
      query = query.ilike('nombre', `%${busqueda}%`);
    }

    const { data: productos, error } = await query;

    if (error) {
      console.error('Error al listar productos:', error);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json({ productos });

  } catch (error) {
    console.error('Error en listarProductos:', error);
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

/**
 * Obtener producto por ID
 */
const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: producto, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ producto });

  } catch (error) {
    console.error('Error en obtenerProducto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

/**
 * Crear nuevo producto (Solo Admin)
 */
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen_url, disponible } = req.body;

    const { data: producto, error } = await supabase
      .from('productos')
      .insert({
        nombre,
        descripcion,
        precio,
        categoria,
        imagen_url: imagen_url || null,
        disponible: disponible !== undefined ? disponible : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear producto:', error);
      return res.status(500).json({ error: 'Error al crear producto' });
    }

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto
    });

  } catch (error) {
    console.error('Error en crearProducto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

/**
 * Actualizar producto (Solo Admin)
 */
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, imagen_url, disponible } = req.body;

    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (precio !== undefined) updateData.precio = precio;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (imagen_url !== undefined) updateData.imagen_url = imagen_url;
    if (disponible !== undefined) updateData.disponible = disponible;
    updateData.updated_at = new Date().toISOString();

    const { data: producto, error } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar producto:', error);
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      producto
    });

  } catch (error) {
    console.error('Error en actualizarProducto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

/**
 * Eliminar producto (Solo Admin)
 */
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar producto:', error);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });

  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
