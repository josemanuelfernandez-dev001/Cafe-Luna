const { generarNumeroPedido, calcularTotal, validarTransicionEstado } = require('../utils/pedidos.util');

describe('Pedidos Utils', () => {
  describe('generarNumeroPedido', () => {
    it('should generate a valid order number format', () => {
      const numero = generarNumeroPedido(1);
      expect(numero).toMatch(/^\d{6}-\d{3}$/);
    });

    it('should pad sequence number correctly', () => {
      expect(generarNumeroPedido(1)).toMatch(/-001$/);
      expect(generarNumeroPedido(42)).toMatch(/-042$/);
      expect(generarNumeroPedido(123)).toMatch(/-123$/);
    });
  });

  describe('calcularTotal', () => {
    it('should calculate total correctly with one item', () => {
      const items = [
        { cantidad: 2, precio_unitario: 45.00 }
      ];
      expect(calcularTotal(items)).toBe(90.00);
    });

    it('should calculate total correctly with multiple items', () => {
      const items = [
        { cantidad: 2, precio_unitario: 45.00 },
        { cantidad: 1, precio_unitario: 35.00 },
        { cantidad: 3, precio_unitario: 20.00 }
      ];
      expect(calcularTotal(items)).toBe(185.00);
    });

    it('should return 0 for empty items array', () => {
      expect(calcularTotal([])).toBe(0);
    });

    it('should handle decimal prices', () => {
      const items = [
        { cantidad: 1, precio_unitario: 45.50 },
        { cantidad: 2, precio_unitario: 33.75 }
      ];
      expect(calcularTotal(items)).toBe(113.00);
    });
  });

  describe('validarTransicionEstado', () => {
    it('should allow valid transitions from pendiente', () => {
      expect(validarTransicionEstado('pendiente', 'en_preparacion')).toBe(true);
      expect(validarTransicionEstado('pendiente', 'cancelado')).toBe(true);
    });

    it('should not allow invalid transitions from pendiente', () => {
      expect(validarTransicionEstado('pendiente', 'listo')).toBe(false);
      expect(validarTransicionEstado('pendiente', 'entregado')).toBe(false);
    });

    it('should allow valid transitions from en_preparacion', () => {
      expect(validarTransicionEstado('en_preparacion', 'listo')).toBe(true);
      expect(validarTransicionEstado('en_preparacion', 'cancelado')).toBe(true);
    });

    it('should not allow invalid transitions from en_preparacion', () => {
      expect(validarTransicionEstado('en_preparacion', 'pendiente')).toBe(false);
      expect(validarTransicionEstado('en_preparacion', 'entregado')).toBe(false);
    });

    it('should allow valid transitions from listo', () => {
      expect(validarTransicionEstado('listo', 'entregado')).toBe(true);
      expect(validarTransicionEstado('listo', 'cancelado')).toBe(true);
    });

    it('should not allow transitions from entregado', () => {
      expect(validarTransicionEstado('entregado', 'pendiente')).toBe(false);
      expect(validarTransicionEstado('entregado', 'cancelado')).toBe(false);
    });

    it('should not allow transitions from cancelado', () => {
      expect(validarTransicionEstado('cancelado', 'pendiente')).toBe(false);
      expect(validarTransicionEstado('cancelado', 'en_preparacion')).toBe(false);
    });
  });
});
