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
  ilike: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn()
}));

// Mock del middleware de autenticación
jest.mock('../middleware/auth.middleware', () => ({
  verificarToken: (req, res, next) => {
    req.user = { id: 'user-123', rol: 'admin' };
    next();
  }
}));

const supabase = require('../config/supabase');

describe('Productos Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/productos', () => {
    it('should list all productos successfully', async () => {
      const mockProductos = [
        {
          id: 'prod-1',
          nombre: 'Latte Grande',
          precio: '45.00',
          categoria: 'bebidas_calientes',
          disponible: true
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockProductos,
        error: null
      });

      const response = await request(app)
        .get('/api/productos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('productos');
      expect(Array.isArray(response.body.productos)).toBe(true);
    });

    it('should filter productos by categoria', async () => {
      supabase.select.mockResolvedValue({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/productos?categoria=bebidas_calientes');

      expect(response.status).toBe(200);
      expect(supabase.eq).toHaveBeenCalled();
    });

    it('should filter productos by disponible', async () => {
      supabase.select.mockResolvedValue({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/productos?disponible=true');

      expect(response.status).toBe(200);
      expect(supabase.eq).toHaveBeenCalled();
    });

    it('should search productos by name', async () => {
      supabase.select.mockResolvedValue({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/productos?busqueda=latte');

      expect(response.status).toBe(200);
      expect(supabase.ilike).toHaveBeenCalled();
    });
  });

  describe('GET /api/productos/:id', () => {
    it('should get producto by id successfully', async () => {
      const mockProducto = {
        id: 'prod-1',
        nombre: 'Latte Grande',
        precio: '45.00',
        categoria: 'bebidas_calientes',
        disponible: true
      };

      supabase.single.mockResolvedValue({
        data: mockProducto,
        error: null
      });

      const response = await request(app)
        .get('/api/productos/prod-1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('producto');
      expect(response.body.producto.id).toBe('prod-1');
    });

    it('should return 404 for non-existent producto', async () => {
      supabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      });

      const response = await request(app)
        .get('/api/productos/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/productos', () => {
    it('should create producto successfully', async () => {
      const mockProducto = {
        id: 'prod-new',
        nombre: 'Capuchino',
        precio: '50.00',
        categoria: 'bebidas_calientes',
        disponible: true
      };

      supabase.single.mockResolvedValue({
        data: mockProducto,
        error: null
      });

      const response = await request(app)
        .post('/api/productos')
        .send({
          nombre: 'Capuchino',
          precio: 50.00,
          categoria: 'bebidas_calientes',
          disponible: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('producto');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/productos')
        .send({
          nombre: 'Capuchino'
          // Missing precio and categoria
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/productos/:id', () => {
    it('should update producto successfully', async () => {
      const mockProducto = {
        id: 'prod-1',
        nombre: 'Latte Grande Actualizado',
        precio: '50.00',
        categoria: 'bebidas_calientes',
        disponible: true
      };

      supabase.single.mockResolvedValue({
        data: mockProducto,
        error: null
      });

      const response = await request(app)
        .put('/api/productos/prod-1')
        .send({
          nombre: 'Latte Grande Actualizado',
          precio: 50.00
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent producto', async () => {
      supabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      });

      const response = await request(app)
        .put('/api/productos/non-existent')
        .send({
          nombre: 'Updated Name'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/productos/:id', () => {
    it('should delete producto successfully', async () => {
      supabase.delete.mockResolvedValue({
        error: null
      });

      const response = await request(app)
        .delete('/api/productos/prod-1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
