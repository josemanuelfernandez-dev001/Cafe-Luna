const supabase = require('../config/supabase');

/**
 * Servicio para operaciones de inventario
 */
class InventarioService {
  
  /**
   * Obtener items con stock bajo
   */
  static async obtenerItemsStockBajo() {
    const { data, error } = await supabase
      .from('inventario')
      .select('*')
      .lte('cantidad_actual', supabase.raw('stock_minimo'))
      .order('cantidad_actual', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Registrar entrada de inventario
   */
  static async registrarEntrada(itemId, cantidad, usuarioId, observaciones = null) {
    // Obtener cantidad actual
    const { data: item, error: errorItem } = await supabase
      .from('inventario')
      .select('cantidad_actual')
      .eq('id', itemId)
      .single();

    if (errorItem) throw errorItem;

    const nuevaCantidad = item.cantidad_actual + cantidad;

    // Actualizar cantidad
    const { error: errorUpdate } = await supabase
      .from('inventario')
      .update({ 
        cantidad_actual: nuevaCantidad,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId);

    if (errorUpdate) throw errorUpdate;

    // Registrar movimiento
    const { error: errorMovimiento } = await supabase
      .from('movimientos_inventario')
      .insert({
        inventario_id: itemId,
        tipo_movimiento: 'entrada',
        cantidad_anterior: item.cantidad_actual,
        cantidad_nueva: nuevaCantidad,
        observaciones,
        usuario_id: usuarioId
      });

    if (errorMovimiento) throw errorMovimiento;

    return { cantidad_anterior: item.cantidad_actual, cantidad_nueva: nuevaCantidad };
  }

  /**
   * Registrar salida de inventario
   */
  static async registrarSalida(itemId, cantidad, usuarioId, observaciones = null) {
    const { data: item, error: errorItem } = await supabase
      .from('inventario')
      .select('cantidad_actual')
      .eq('id', itemId)
      .single();

    if (errorItem) throw errorItem;

    if (item.cantidad_actual < cantidad) {
      throw new Error('Stock insuficiente');
    }

    const nuevaCantidad = item.cantidad_actual - cantidad;

    const { error: errorUpdate } = await supabase
      .from('inventario')
      .update({ 
        cantidad_actual: nuevaCantidad,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId);

    if (errorUpdate) throw errorUpdate;

    const { error: errorMovimiento } = await supabase
      .from('movimientos_inventario')
      .insert({
        inventario_id: itemId,
        tipo_movimiento: 'salida',
        cantidad_anterior: item.cantidad_actual,
        cantidad_nueva: nuevaCantidad,
        observaciones,
        usuario_id: usuarioId
      });

    if (errorMovimiento) throw errorMovimiento;

    return { cantidad_anterior: item.cantidad_actual, cantidad_nueva: nuevaCantidad };
  }

  /**
   * Obtener historial de movimientos
   */
  static async obtenerHistorial(itemId, limite = 50) {
    const { data, error } = await supabase
      .from('movimientos_inventario')
      .select(`
        *,
        usuario:usuarios(nombre)
      `)
      .eq('inventario_id', itemId)
      .order('created_at', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return data;
  }
}

module.exports = InventarioService;
