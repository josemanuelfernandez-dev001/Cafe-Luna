const supabase = require('../config/supabase');
const { generarNumeroPedido, calcularTotal, validarTransicionEstado } = require('../utils/pedidos.util');

/**
 * Crear nuevo pedido
 */
const crearPedido = async (req, res) => {
  try {
    const { tipo, items, observaciones, cliente_nombre, cliente_telefono, direccion, numero_externo } = req.body;
    const usuario_id = req.user.id;

    // Obtener información de productos
    const productoIds = items.map(item => item.producto_id);
    const { data: productos, error: errorProductos } = await supabase
      .from('productos')
      .select('id, nombre, precio, disponible')
      .in('id', productoIds);

    if (errorProductos || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Productos no encontrados' });
    }

    // Validar disponibilidad
    const productosNoDisponibles = productos.filter(p => !p.disponible);
    if (productosNoDisponibles.length > 0) {
      return res.status(400).json({ 
        error: 'Algunos productos no están disponibles',
        productos: productosNoDisponibles.map(p => p.nombre)
      });
    }

    // Calcular total
    const itemsConPrecios = items.map(item => {
      const producto = productos.find(p => p.id === item.producto_id);
      return {
        ...item,
        precio_unitario: producto.precio
      };
    });
    const total = calcularTotal(itemsConPrecios);

    // Obtener secuencia del día para número de pedido
    const hoy = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${hoy}T00:00:00`)
      .lt('created_at', `${hoy}T23:59:59`);

    const numeroPedido = generarNumeroPedido((count || 0) + 1);

    // Crear pedido
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido: numeroPedido,
        tipo,
        estado: 'pendiente',
        total,
        observaciones,
        cliente_nombre,
        cliente_telefono,
        direccion,
        numero_externo,
        usuario_id
      })
      .select()
      .single();

    if (errorPedido) {
      console.error('Error al crear pedido:', errorPedido);
      return res.status(500).json({ error: 'Error al crear pedido' });
    }

    // Crear items del pedido
    const itemsParaInsertar = itemsConPrecios.map(item => ({
      pedido_id: pedido.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.cantidad * item.precio_unitario
    }));

    const { error: errorItems } = await supabase
      .from('pedido_items')
      .insert(itemsParaInsertar);

    if (errorItems) {
      console.error('Error al crear items:', errorItems);
      // Intentar eliminar el pedido si falla la inserción de items
      await supabase.from('pedidos').delete().eq('id', pedido.id);
      return res.status(500).json({ error: 'Error al crear items del pedido' });
    }

    // Registrar historial
    await supabase
      .from('historial_pedidos')
      .insert({
        pedido_id: pedido.id,
        estado_anterior: null,
        estado_nuevo: 'pendiente',
        usuario_id
      });

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido: {
        ...pedido,
        items: itemsParaInsertar
      }
    });

  } catch (error) {
    console.error('Error en crearPedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

/**
 * Listar pedidos con filtros
 */
const listarPedidos = async (req, res) => {
  try {
    const { estado, tipo, fecha } = req.query;
    
    let query = supabase
      .from('pedidos')
      .select(`
        *,
        usuario:usuarios(nombre, email),
        items:pedido_items(
          *,
          producto:productos(nombre, categoria)
        )
      `)
      .order('created_at', { ascending: false });

    if (estado) {
      query = query.eq('estado', estado);
    }

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (fecha) {
      query = query.gte('created_at', `${fecha}T00:00:00`)
                   .lt('created_at', `${fecha}T23:59:59`);
    }

    const { data: pedidos, error } = await query;

    if (error) {
      console.error('Error al listar pedidos:', error);
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }

    res.json({ pedidos });

  } catch (error) {
    console.error('Error en listarPedidos:', error);
    res.status(500).json({ error: 'Error al listar pedidos' });
  }
};

/**
 * Obtener pedido por ID
 */
const obtenerPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        usuario:usuarios(nombre, email),
        items:pedido_items(
          *,
          producto:productos(nombre, categoria, precio)
        ),
        historial:historial_pedidos(
          *,
          usuario:usuarios(nombre)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ pedido });

  } catch (error) {
    console.error('Error en obtenerPedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

/**
 * Actualizar estado de pedido
 */
const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado: nuevoEstado } = req.body;
    const usuario_id = req.user.id;

    // Obtener pedido actual
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .select('estado')
      .eq('id', id)
      .single();

    if (errorPedido || !pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Validar transición de estado
    if (!validarTransicionEstado(pedido.estado, nuevoEstado)) {
      return res.status(400).json({ 
        error: 'Transición de estado inválida',
        estadoActual: pedido.estado,
        estadoSolicitado: nuevoEstado
      });
    }

    // Actualizar estado
    const { data: pedidoActualizado, error: errorActualizar } = await supabase
      .from('pedidos')
      .update({ 
        estado: nuevoEstado,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (errorActualizar) {
      console.error('Error al actualizar estado:', errorActualizar);
      return res.status(500).json({ error: 'Error al actualizar estado' });
    }

    // Registrar en historial
    await supabase
      .from('historial_pedidos')
      .insert({
        pedido_id: id,
        estado_anterior: pedido.estado,
        estado_nuevo: nuevoEstado,
        usuario_id
      });

    res.json({
      message: 'Estado actualizado exitosamente',
      pedido: pedidoActualizado
    });

  } catch (error) {
    console.error('Error en actualizarEstado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

module.exports = {
  crearPedido,
  listarPedidos,
  obtenerPedido,
  actualizarEstado
};
