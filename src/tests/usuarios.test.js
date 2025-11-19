const request = require('supertest');
const app = require('../app');

// Mock de Supabase
jest.mock('../config/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn()
}));

// Mock del middleware de autenticación (admin)
jest.mock('../middleware/auth.middleware', () => (req, res, next) => {
  req.user = { id: 'user-123', rol: 'admin' };
  next();
});

const supabase = require('../config/supabase');

describe('Usuarios Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/usuarios', () => {
    it('should list all usuarios successfully', async () => {
      const mockUsuarios = [
        {
          id: 'user-1',
          email: 'admin@cafeluna.com',
          nombre: 'Admin',
          rol: 'admin',
          activo: true
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockUsuarios,
        error: null
      });

      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuarios');
      expect(Array.isArray(response.body.usuarios)).toBe(true);
    });

    it('should not include password_hash in response', async () => {
      const mockUsuarios = [
        {
          id: 'user-1',
          email: 'admin@cafeluna.com',
          nombre: 'Admin',
          rol: 'admin',
          activo: true,
          password_hash: 'should_not_be_included'
        }
      ];

      supabase.select.mockResolvedValue({
        data: mockUsuarios,
        error: null
      });

      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(200);
      expect(response.body.usuarios[0]).not.toHaveProperty('password_hash');
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('should get usuario by id successfully', async () => {
      const mockUsuario = {
        id: 'user-1',
        email: 'admin@cafeluna.com',
        nombre: 'Admin',
        rol: 'admin',
        activo: true
      };

      supabase.single.mockResolvedValue({
        data: mockUsuario,
        error: null
      });

      const response = await request(app)
        .get('/api/usuarios/user-1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario.id).toBe('user-1');
    });

    it('should return 404 for non-existent usuario', async () => {
      supabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      });

      const response = await request(app)
        .get('/api/usuarios/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/usuarios', () => {
    it('should create usuario successfully', async () => {
      const mockUsuario = {
        id: 'user-new',
        email: 'nuevo@cafeluna.com',
        nombre: 'Nuevo Usuario',
        rol: 'barista',
        activo: true
      };

      supabase.single.mockResolvedValue({
        data: mockUsuario,
        error: null
      });

      const response = await request(app)
        .post('/api/usuarios')
        .send({
          email: 'nuevo@cafeluna.com',
          password: 'password123',
          nombre: 'Nuevo Usuario',
          rol: 'barista'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('usuario');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/usuarios')
        .send({
          email: 'nuevo@cafeluna.com'
          // Missing password, nombre, rol
        });

      expect(response.status).toBe(400);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/usuarios')
        .send({
          email: 'invalid-email',
          password: 'password123',
          nombre: 'Test',
          rol: 'barista'
        });

      expect(response.status).toBe(400);
    });

    it('should validate rol values', async () => {
      const response = await request(app)
        .post('/api/usuarios')
        .send({
          email: 'nuevo@cafeluna.com',
          password: 'password123',
          nombre: 'Test',
          rol: 'invalid_role'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('should update usuario successfully', async () => {
      const mockUsuario = {
        id: 'user-1',
        email: 'admin@cafeluna.com',
        nombre: 'Admin Actualizado',
        rol: 'admin',
        activo: true
      };

      supabase.single.mockResolvedValue({
        data: mockUsuario,
        error: null
      });

      const response = await request(app)
        .put('/api/usuarios/user-1')
        .send({
          nombre: 'Admin Actualizado'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should allow updating password', async () => {
      const mockUsuario = {
        id: 'user-1',
        email: 'admin@cafeluna.com',
        nombre: 'Admin',
        rol: 'admin',
        activo: true
      };

      supabase.single.mockResolvedValue({
        data: mockUsuario,
        error: null
      });

      const response = await request(app)
        .put('/api/usuarios/user-1')
        .send({
          password: 'newpassword123'
        });

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent usuario', async () => {
      supabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      });

      const response = await request(app)
        .put('/api/usuarios/non-existent')
        .send({
          nombre: 'Updated Name'
        });

      expect(response.status).toBe(404);
    });
  });
});
