const supabase = require('../config/supabase');

/**
 * Listar inventario
 */
const listarInventario = async (req, res) => {
  try {
    const { alerta_stock } = req.query;

    let query = supabase
      .from('inventario')
      .select('*')
      .order('nombre', { ascending: true });

    if (alerta_stock === 'true') {
      query = query.lte('cantidad_actual', supabase.raw('stock_minimo'));
    }

    const { data: inventario, error } = await query;

    if (error) {
      console.error('Error al listar inventario:', error);
      return res.status(500).json({ error: 'Error al obtener inventario' });
    }

    res.json({ inventario });

  } catch (error) {
    console.error('Error en listarInventario:', error);
    res.status(500).json({ error: 'Error al listar inventario' });
  }
};

/**
 * Obtener item de inventario por ID
 */
const obtenerItemInventario = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabase
      .from('inventario')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json({ item });

  } catch (error) {
    console.error('Error en obtenerItemInventario:', error);
    res.status(500).json({ error: 'Error al obtener item' });
  }
};

/**
 * Actualizar cantidad de inventario
 */
const actualizarInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad_actual, tipo_movimiento, observaciones } = req.body;
    const usuario_id = req.user.id;

    // Obtener item actual
    const { data: itemActual, error: errorItem } = await supabase
      .from('inventario')
      .select('cantidad_actual')
      .eq('id', id)
      .single();

    if (errorItem || !itemActual) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    // Actualizar cantidad
    const { data: itemActualizado, error: errorActualizar } = await supabase
      .from('inventario')
      .update({ 
        cantidad_actual,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (errorActualizar) {
      console.error('Error al actualizar inventario:', errorActualizar);
      return res.status(500).json({ error: 'Error al actualizar inventario' });
    }

    // Registrar movimiento si se especificó
    if (tipo_movimiento) {
      await supabase
        .from('movimientos_inventario')
        .insert({
          inventario_id: id,
          tipo_movimiento,
          cantidad_anterior: itemActual.cantidad_actual,
          cantidad_nueva: cantidad_actual,
          observaciones,
          usuario_id
        });
    }

    res.json({
      message: 'Inventario actualizado exitosamente',
      item: itemActualizado
    });

  } catch (error) {
    console.error('Error en actualizarInventario:', error);
    res.status(500).json({ error: 'Error al actualizar inventario' });
  }
};

module.exports = {
  listarInventario,
  obtenerItemInventario,
  actualizarInventario
};
