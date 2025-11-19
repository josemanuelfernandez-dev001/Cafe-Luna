const { 
  validationErrorHandler, 
  databaseErrorHandler,
  safeLog 
} = require('../middleware/error.middleware');

describe('Error Middleware', () => {
  describe('validationErrorHandler', () => {
    it('should format validation errors correctly', () => {
      const mockErrors = {
        array: () => [
          { param: 'email', msg: 'Email is required', value: '' },
          { param: 'password', msg: 'Password must be 8+ characters', value: '123' }
        ]
      };

      const error = validationErrorHandler(mockErrors);

      expect(error.message).toBe('Errores de validación');
      expect(error.statusCode).toBe(400);
      expect(error.details).toHaveLength(2);
      expect(error.details[0]).toMatchObject({
        field: 'email',
        message: 'Email is required',
        value: ''
      });
    });
  });

  describe('databaseErrorHandler', () => {
    it('should handle unique constraint violation (23505)', () => {
      const dbError = { code: '23505' };
      const error = databaseErrorHandler(dbError);

      expect(error.message).toBe('El registro ya existe');
      expect(error.statusCode).toBe(409);
    });

    it('should handle foreign key violation (23503)', () => {
      const dbError = { code: '23503' };
      const error = databaseErrorHandler(dbError);

      expect(error.message).toBe('Referencia inválida a otro registro');
      expect(error.statusCode).toBe(400);
    });

    it('should handle not null violation (23502)', () => {
      const dbError = { code: '23502' };
      const error = databaseErrorHandler(dbError);

      expect(error.message).toBe('Faltan campos requeridos');
      expect(error.statusCode).toBe(400);
    });

    it('should handle generic database errors', () => {
      const dbError = { code: '99999' };
      const error = databaseErrorHandler(dbError);

      expect(error.message).toBe('Error al procesar la solicitud en la base de datos');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('safeLog', () => {
    let consoleErrorSpy;
    let consoleWarnSpy;
    let consoleInfoSpy;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });

    it('should log error messages', () => {
      safeLog.error('Test error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');
    });

    it('should log warning messages', () => {
      safeLog.warn('Test warning');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning');
    });

    it('should log info messages', () => {
      safeLog.info('Test info');
      expect(consoleInfoSpy).toHaveBeenCalledWith('Test info');
    });

    it('should sanitize log messages by removing control characters', () => {
      const messageWithControls = 'Test\x00message\x08with\x1Fcontrols';
      safeLog.info(messageWithControls);
      expect(consoleInfoSpy).toHaveBeenCalledWith('Testmessagewithcontrols');
    });

    it('should handle error objects in error log', () => {
      const error = new Error('Test error');
      safeLog.error('Error occurred', error);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
