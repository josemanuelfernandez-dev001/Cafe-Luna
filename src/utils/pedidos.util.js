/**
 * Genera un número único de pedido en formato DDMMYY-XXX
 * @param {number} secuencia - Número secuencial del pedido del día
 * @returns {string} - Número de pedido único
 */
const generarNumeroPedido = (secuencia) => {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = String(fecha.getFullYear()).slice(-2);
  const secuenciaStr = String(secuencia).padStart(3, '0');
  
  return `${dia}${mes}${anio}-${secuenciaStr}`;
};

/**
 * Calcula el total de un pedido basado en los items
 * @param {Array} items - Array de items con producto_id, cantidad y precio_unitario
 * @returns {number} - Total del pedido
 */
const calcularTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.cantidad * item.precio_unitario);
  }, 0);
};

/**
 * Valida transiciones de estado válidas
 * @param {string} estadoActual - Estado actual del pedido
 * @param {string} nuevoEstado - Nuevo estado deseado
 * @returns {boolean} - True si la transición es válida
 */
const validarTransicionEstado = (estadoActual, nuevoEstado) => {
  const transicionesValidas = {
    'pendiente': ['en_preparacion', 'cancelado'],
    'en_preparacion': ['listo', 'cancelado'],
    'listo': ['entregado', 'cancelado'],
    'entregado': [],
    'cancelado': []
  };

  return transicionesValidas[estadoActual]?.includes(nuevoEstado) || false;
};

module.exports = {
  generarNumeroPedido,
  calcularTotal,
  validarTransicionEstado
};
