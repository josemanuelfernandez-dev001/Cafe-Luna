const request = require('supertest');
const app = require('../app');

// Mock de Supabase
jest.mock('../config/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn()
}));

// Mock del middleware de autenticación
jest.mock('../middleware/auth.middleware', () => (req, res, next) => {
  req.user = { id: 'user-123', rol: 'barista' };
  next();
});

const supabase = require('../config/supabase');

describe('Inventario Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/inventario', () => {
    it('should list all inventario items successfully', async () => {
      const mockInventario = [
        {
          id: 'inv-1',
          nombre: 'Café en grano',
          cantidad: 50,
          unidad: 'kg',
          minimo: 10
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockInventario,
        error: null
      });

      const response = await request(app)
        .get('/api/inventario');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('inventario');
      expect(Array.isArray(response.body.inventario)).toBe(true);
    });

    it('should filter items with low stock alert', async () => {
      const mockInventario = [
        {
          id: 'inv-1',
          nombre: 'Café en grano',
          cantidad: 5,
          unidad: 'kg',
          minimo: 10
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockInventario,
        error: null
      });

      const response = await request(app)
        .get('/api/inventario?alerta=true');

      expect(response.status).toBe(200);
      expect(response.body.inventario.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/inventario/:id', () => {
    it('should get inventario item by id successfully', async () => {
      const mockItem = {
        id: 'inv-1',
        nombre: 'Café en grano',
        cantidad: 50,
        unidad: 'kg',
        minimo: 10
      };

      supabase.single.mockResolvedValue({
        data: mockItem,
        error: null
      });

      const response = await request(app)
        .get('/api/inventario/inv-1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('item');
      expect(response.body.item.id).toBe('inv-1');
    });

    it('should return 404 for non-existent item', async () => {
      supabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      });

      const response = await request(app)
        .get('/api/inventario/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/inventario/:id', () => {
    it('should update inventario successfully with entrada', async () => {
      const mockItem = {
        id: 'inv-1',
        nombre: 'Café en grano',
        cantidad: 50,
        unidad: 'kg',
        minimo: 10
      };

      // Mock para obtener item actual
      supabase.single.mockResolvedValueOnce({
        data: mockItem,
        error: null
      });

      // Mock para update
      supabase.single.mockResolvedValueOnce({
        data: { ...mockItem, cantidad: 100 },
        error: null
      });

      // Mock para insert movimiento
      supabase.insert.mockResolvedValue({
        error: null
      });

      const response = await request(app)
        .put('/api/inventario/inv-1')
        .send({
          cantidad: 50,
          tipo_movimiento: 'entrada',
          observaciones: 'Compra semanal'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should update inventario successfully with salida', async () => {
      const mockItem = {
        id: 'inv-1',
        nombre: 'Café en grano',
        cantidad: 50,
        unidad: 'kg',
        minimo: 10
      };

      supabase.single.mockResolvedValueOnce({
        data: mockItem,
        error: null
      });

      supabase.single.mockResolvedValueOnce({
        data: { ...mockItem, cantidad: 30 },
        error: null
      });

      supabase.insert.mockResolvedValue({
        error: null
      });

      const response = await request(app)
        .put('/api/inventario/inv-1')
        .send({
          cantidad: 20,
          tipo_movimiento: 'salida',
          observaciones: 'Uso diario'
        });

      expect(response.status).toBe(200);
    });

    it('should fail when cantidad is invalid', async () => {
      const response = await request(app)
        .put('/api/inventario/inv-1')
        .send({
          cantidad: -10,
          tipo_movimiento: 'entrada'
        });

      expect(response.status).toBe(400);
    });
  });
});
