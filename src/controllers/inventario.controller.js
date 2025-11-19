const supabase = require('../config/supabase');
const InventarioService = require('../services/inventario.service');

/**
 * Listar insumos (inventario)
 */
const listarInsumos = async (req, res) => {
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

    res.json({ insumos: inventario });

  } catch (error) {
    console.error('Error en listarInsumos:', error);
    res.status(500).json({ error: 'Error al listar insumos' });
  }
};

/**
 * Listar inventario (alias para compatibilidad)
 */
const listarInventario = async (req, res) => {
  return listarInsumos(req, res);
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

/**
 * Crear nuevo insumo
 */
const crearInsumo = async (req, res) => {
  try {
    const { nombre, descripcion, unidad_medida, cantidad_actual, stock_minimo } = req.body;

    const { data: insumo, error } = await supabase
      .from('inventario')
      .insert({
        nombre,
        descripcion,
        unidad_medida,
        cantidad_actual: cantidad_actual || 0,
        stock_minimo: stock_minimo || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear insumo:', error);
      return res.status(500).json({ error: 'Error al crear insumo' });
    }

    res.status(201).json({
      message: 'Insumo creado exitosamente',
      insumo
    });

  } catch (error) {
    console.error('Error en crearInsumo:', error);
    res.status(500).json({ error: 'Error al crear insumo' });
  }
};

/**
 * Registrar entrada de inventario
 */
const registrarEntrada = async (req, res) => {
  try {
    const { inventario_id, cantidad, observaciones } = req.body;
    const usuario_id = req.user.id;

    const resultado = await InventarioService.registrarEntrada(
      inventario_id,
      cantidad,
      usuario_id,
      observaciones
    );

    res.json({
      message: 'Entrada registrada exitosamente',
      movimiento: resultado
    });

  } catch (error) {
    console.error('Error en registrarEntrada:', error);
    res.status(500).json({ error: error.message || 'Error al registrar entrada' });
  }
};

/**
 * Registrar salida de inventario
 */
const registrarSalida = async (req, res) => {
  try {
    const { inventario_id, cantidad, observaciones } = req.body;
    const usuario_id = req.user.id;

    const resultado = await InventarioService.registrarSalida(
      inventario_id,
      cantidad,
      usuario_id,
      observaciones
    );

    res.json({
      message: 'Salida registrada exitosamente',
      movimiento: resultado
    });

  } catch (error) {
    console.error('Error en registrarSalida:', error);
    res.status(500).json({ error: error.message || 'Error al registrar salida' });
  }
};

/**
 * Ver alertas de stock bajo
 */
const verAlertas = async (req, res) => {
  try {
    const items = await InventarioService.obtenerItemsStockBajo();

    res.json({
      alertas: items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad_actual: item.cantidad_actual,
        stock_minimo: item.stock_minimo,
        unidad_medida: item.unidad_medida,
        faltante: item.stock_minimo - item.cantidad_actual
      }))
    });

  } catch (error) {
    console.error('Error en verAlertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

/**
 * Listar movimientos de inventario
 */
const listarMovimientos = async (req, res) => {
  try {
    const { inventario_id, limite } = req.query;

    let query = supabase
      .from('movimientos_inventario')
      .select(`
        *,
        usuario:usuarios(nombre, email),
        inventario:inventario(nombre)
      `)
      .order('created_at', { ascending: false });

    if (inventario_id) {
      query = query.eq('inventario_id', inventario_id);
    }

    if (limite) {
      query = query.limit(parseInt(limite));
    } else {
      query = query.limit(50);
    }

    const { data: movimientos, error } = await query;

    if (error) {
      console.error('Error al listar movimientos:', error);
      return res.status(500).json({ error: 'Error al obtener movimientos' });
    }

    res.json({ movimientos });

  } catch (error) {
    console.error('Error en listarMovimientos:', error);
    res.status(500).json({ error: 'Error al listar movimientos' });
  }
};

module.exports = {
  listarInventario,
  listarInsumos,
  obtenerItemInventario,
  actualizarInventario,
  crearInsumo,
  registrarEntrada,
  registrarSalida,
  verAlertas,
  listarMovimientos
};
