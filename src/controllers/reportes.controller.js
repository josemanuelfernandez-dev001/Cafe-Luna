const supabase = require('../config/supabase');

/**
 * Reporte de ventas diarias con desglose por hora
 */
const ventasDiarias = async (req, res) => {
  try {
    const { fecha } = req.query;
    
    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es requerida' });
    }

    // Obtener pedidos del día
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        numero_pedido,
        tipo,
        estado,
        total,
        created_at,
        items:pedido_items(
          cantidad,
          subtotal,
          producto:productos(nombre, categoria)
        )
      `)
      .gte('created_at', `${fecha}T00:00:00`)
      .lt('created_at', `${fecha}T23:59:59`)
      .in('estado', ['listo', 'entregado']);

    if (error) {
      console.error('Error al obtener ventas:', error);
      return res.status(500).json({ error: 'Error al obtener reporte' });
    }

    // Calcular métricas
    const totalVentas = pedidos.reduce((sum, pedido) => sum + parseFloat(pedido.total), 0);
    const cantidadPedidos = pedidos.length;
    const ticketPromedio = cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0;

    // Desglose por hora
    const ventasPorHora = Array.from({ length: 24 }, (_, i) => ({
      hora: i,
      cantidad: 0,
      total: 0
    }));

    pedidos.forEach(pedido => {
      const hora = new Date(pedido.created_at).getHours();
      ventasPorHora[hora].cantidad++;
      ventasPorHora[hora].total += parseFloat(pedido.total);
    });

    // Desglose por origen
    const porOrigen = pedidos.reduce((acc, pedido) => {
      if (!acc[pedido.tipo]) {
        acc[pedido.tipo] = {
          cantidad: 0,
          total: 0
        };
      }
      acc[pedido.tipo].cantidad++;
      acc[pedido.tipo].total += parseFloat(pedido.total);
      return acc;
    }, {});

    // Desglose por categoría de producto
    const porCategoria = {};
    pedidos.forEach(pedido => {
      pedido.items.forEach(item => {
        const categoria = item.producto.categoria;
        if (!porCategoria[categoria]) {
          porCategoria[categoria] = {
            cantidad: 0,
            total: 0
          };
        }
        porCategoria[categoria].cantidad += item.cantidad;
        porCategoria[categoria].total += parseFloat(item.subtotal);
      });
    });

    // Productos más vendidos
    const productosVendidos = {};
    pedidos.forEach(pedido => {
      pedido.items.forEach(item => {
        const nombre = item.producto.nombre;
        if (!productosVendidos[nombre]) {
          productosVendidos[nombre] = {
            cantidad: 0,
            total: 0
          };
        }
        productosVendidos[nombre].cantidad += item.cantidad;
        productosVendidos[nombre].total += parseFloat(item.subtotal);
      });
    });

    const topProductos = Object.entries(productosVendidos)
      .sort((a, b) => b[1].cantidad - a[1].cantidad)
      .slice(0, 10)
      .map(([nombre, datos]) => ({ nombre, ...datos }));

    // Comparación con día anterior
    const fechaAnterior = new Date(fecha);
    fechaAnterior.setDate(fechaAnterior.getDate() - 1);
    const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

    const { data: pedidosAyer } = await supabase
      .from('pedidos')
      .select('total')
      .gte('created_at', `${fechaAnteriorStr}T00:00:00`)
      .lt('created_at', `${fechaAnteriorStr}T23:59:59`)
      .in('estado', ['listo', 'entregado']);

    const totalAyer = pedidosAyer ? pedidosAyer.reduce((sum, p) => sum + parseFloat(p.total), 0) : 0;
    const comparacion = {
      fecha_anterior: fechaAnteriorStr,
      total_anterior: parseFloat(totalAyer.toFixed(2)),
      diferencia: parseFloat((totalVentas - totalAyer).toFixed(2)),
      porcentaje: totalAyer > 0 ? parseFloat(((totalVentas - totalAyer) / totalAyer * 100).toFixed(2)) : 0
    };

    res.json({
      fecha,
      metricas: {
        total_ventas: parseFloat(totalVentas.toFixed(2)),
        cantidad_pedidos: cantidadPedidos,
        ticket_promedio: parseFloat(ticketPromedio.toFixed(2))
      },
      ventas_por_hora: ventasPorHora.filter(h => h.cantidad > 0),
      por_origen: porOrigen,
      por_categoria: porCategoria,
      top_productos: topProductos,
      comparacion,
      pedidos
    });

  } catch (error) {
    console.error('Error en ventasDiarias:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

/**
 * Reporte de ventas por período
 */
const ventasPorPeriodo = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Las fechas son requeridas' });
    }

    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('id, tipo, estado, total, created_at')
      .gte('created_at', `${fecha_inicio}T00:00:00`)
      .lte('created_at', `${fecha_fin}T23:59:59`)
      .in('estado', ['listo', 'entregado']);

    if (error) {
      console.error('Error al obtener ventas:', error);
      return res.status(500).json({ error: 'Error al obtener reporte' });
    }

    const totalVentas = pedidos.reduce((sum, pedido) => sum + parseFloat(pedido.total), 0);
    const cantidadPedidos = pedidos.length;

    res.json({
      fecha_inicio,
      fecha_fin,
      total_ventas: parseFloat(totalVentas.toFixed(2)),
      cantidad_pedidos: cantidadPedidos,
      ticket_promedio: cantidadPedidos > 0 ? parseFloat((totalVentas / cantidadPedidos).toFixed(2)) : 0
    });

  } catch (error) {
    console.error('Error en ventasPorPeriodo:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

module.exports = {
  ventasDiarias,
  ventasPorPeriodo
};
