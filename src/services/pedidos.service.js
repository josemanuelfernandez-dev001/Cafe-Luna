const supabase = require('../config/supabase');

/**
 * Servicio para operaciones de pedidos
 */
class PedidosService {
  
  /**
   * Obtener pedidos activos (pendientes o en preparación)
   */
  static async obtenerPedidosActivos() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        usuario:usuarios(nombre),
        items:pedido_items(
          *,
          producto:productos(nombre, categoria)
        )
      `)
      .in('estado', ['pendiente', 'en_preparacion'])
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener tiempo de espera de un pedido
   */
  static calcularTiempoEspera(fechaCreacion) {
    const ahora = new Date();
    const creacion = new Date(fechaCreacion);
    const minutos = Math.floor((ahora - creacion) / 1000 / 60);
    return minutos;
  }

  /**
   * Obtener color según tiempo de espera
   */
  static obtenerColorPorTiempo(minutos) {
    if (minutos >= 30) return 'rojo';
    if (minutos >= 15) return 'amarillo';
    return 'verde';
  }

  /**
   * Suscribirse a cambios en tiempo real
   */
  static suscribirCambios(callback) {
    return supabase
      .channel('pedidos_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'pedidos' 
        },
        callback
      )
      .subscribe();
  }
}

module.exports = PedidosService;
