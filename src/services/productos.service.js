const supabase = require('../config/supabase');

/**
 * Servicio para operaciones de productos
 */
class ProductosService {
  
  /**
   * Obtener productos disponibles por categoría
   */
  static async obtenerProductosPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria', categoria)
      .eq('disponible', true)
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener todas las categorías
   */
  static getCategorias() {
    return [
      { value: 'bebida_caliente', label: 'Bebida Caliente' },
      { value: 'bebida_fria', label: 'Bebida Fría' },
      { value: 'alimento', label: 'Alimento' },
      { value: 'postre', label: 'Postre' },
      { value: 'snack', label: 'Snack' }
    ];
  }

  /**
   * Verificar disponibilidad de productos
   */
  static async verificarDisponibilidad(productosIds) {
    const { data, error } = await supabase
      .from('productos')
      .select('id, nombre, disponible')
      .in('id', productosIds);

    if (error) throw error;
    
    const noDisponibles = data.filter(p => !p.disponible);
    return {
      disponibles: noDisponibles.length === 0,
      productos_no_disponibles: noDisponibles
    };
  }

  /**
   * Actualizar disponibilidad masiva
   */
  static async actualizarDisponibilidadMasiva(productosIds, disponible) {
    const { data, error } = await supabase
      .from('productos')
      .update({ disponible, updated_at: new Date().toISOString() })
      .in('id', productosIds)
      .select();

    if (error) throw error;
    return data;
  }
}

module.exports = ProductosService;
