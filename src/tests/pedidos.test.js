const request = require('supertest');
const app = require('../app');

// Mock de Supabase
jest.mock('../config/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn()
}));

// Mock del middleware de autenticación
jest.mock('../middleware/auth.middleware', () => ({
  verificarToken: (req, res, next) => {
    req.user = { id: 'user-123', rol: 'barista' };
    next();
  }
}));

const supabase = require('../config/supabase');

describe('Pedidos Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pedidos', () => {
    it('should list all pedidos successfully', async () => {
      const mockPedidos = [
        {
          id: 'pedido-1',
          numero_pedido: '191125-001',
          tipo: 'mostrador',
          estado: 'pendiente',
          total: '100.00'
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockPedidos,
        error: null
      });

      const response = await request(app)
        .get('/api/pedidos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pedidos');
      expect(Array.isArray(response.body.pedidos)).toBe(true);
    });

    it('should filter pedidos by estado', async () => {
      supabase.select.mockResolvedValue({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/pedidos?estado=pendiente');

      expect(response.status).toBe(200);
      expect(supabase.eq).toHaveBeenCalled();
    });

    it('should filter pedidos by tipo', async () => {
      supabase.select.mockResolvedValue({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/pedidos?tipo=uber_eats');

      expect(response.status).toBe(200);
      expect(supabase.eq).toHaveBeenCalled();
    });
  });

  describe('POST /api/pedidos', () => {
    it('should create pedido successfully', async () => {
      const mockProductos = [
        {
          id: 'prod-1',
          nombre: 'Latte',
          precio: '45.00',
          disponible: true
        }
      ];

      const mockPedido = {
        id: 'pedido-new',
        numero_pedido: '191125-002',
        tipo: 'mostrador',
        estado: 'pendiente',
        total: '90.00'
      };

      // Mock para productos
      supabase.select.mockResolvedValueOnce({
        data: mockProductos,
        error: null
      });

      // Mock para count
      supabase.select.mockResolvedValueOnce({
        count: 5,
        error: null
      });

      // Mock para insert pedido
      supabase.single.mockResolvedValueOnce({
        data: mockPedido,
        error: null
      });

      // Mock para insert items
      supabase.insert.mockResolvedValueOnce({
        error: null
      });

      // Mock para insert historial
      supabase.insert.mockResolvedValueOnce({
        error: null
      });

      const response = await request(app)
        .post('/api/pedidos')
        .send({
          tipo: 'mostrador',
          items: [
            { producto_id: 'prod-1', cantidad: 2 }
          ],
          cliente_nombre: 'Juan Pérez'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('pedido');
    });

    it('should fail when products are not available', async () => {
      const mockProductos = [
        {
          id: 'prod-1',
          nombre: 'Latte',
          precio: '45.00',
          disponible: false
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockProductos,
        error: null
      });

      const response = await request(app)
        .post('/api/pedidos')
        .send({
          tipo: 'mostrador',
          items: [
            { producto_id: 'prod-1', cantidad: 2 }
          ]
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/pedidos/:id/estado', () => {
    it('should update pedido estado successfully', async () => {
      const mockPedido = {
        id: 'pedido-1',
        numero_pedido: '191125-001',
        estado: 'pendiente'
      };

      // Mock para obtener pedido
      supabase.single.mockResolvedValueOnce({
        data: mockPedido,
        error: null
      });

      // Mock para update
      supabase.single.mockResolvedValueOnce({
        data: { ...mockPedido, estado: 'en_preparacion' },
        error: null
      });

      // Mock para insert historial
      supabase.insert.mockResolvedValue({
        error: null
      });

      const response = await request(app)
        .patch('/api/pedidos/pedido-1/estado')
        .send({
          estado: 'en_preparacion'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail with invalid estado transition', async () => {
      const mockPedido = {
        id: 'pedido-1',
        numero_pedido: '191125-001',
        estado: 'entregado'
      };

      supabase.single.mockResolvedValue({
        data: mockPedido,
        error: null
      });

      const response = await request(app)
        .patch('/api/pedidos/pedido-1/estado')
        .send({
          estado: 'pendiente'
        });

      expect(response.status).toBe(400);
    });
  });
});
