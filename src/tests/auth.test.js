const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../app');

// Mock de Supabase
jest.mock('../config/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn()
}));

const supabase = require('../config/supabase');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@cafeluna.com',
        nombre: 'Test User',
        rol: 'admin',
        password_hash: await bcrypt.hash('password123', 10),
        activo: true
      };

      supabase.single.mockResolvedValue({
        data: mockUser,
        error: null
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cafeluna.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login exitoso');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        nombre: mockUser.nombre,
        rol: mockUser.rol
      });
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      supabase.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@cafeluna.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    it('should fail with invalid password', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@cafeluna.com',
        nombre: 'Test User',
        rol: 'admin',
        password_hash: await bcrypt.hash('password123', 10),
        activo: true
      };

      supabase.single.mockResolvedValue({
        data: mockUser,
        error: null
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cafeluna.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    it('should fail for inactive user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@cafeluna.com',
        nombre: 'Test User',
        rol: 'admin',
        password_hash: await bcrypt.hash('password123', 10),
        activo: false
      };

      supabase.single.mockResolvedValue({
        data: null,
        error: null
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@cafeluna.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Sesión cerrada exitosamente');
    });
  });

  describe('GET /api/auth/verificar', () => {
    it('should return authenticated false when no session', async () => {
      const response = await request(app)
        .get('/api/auth/verificar');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('authenticated', false);
    });
  });
});
