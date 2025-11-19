/**
 * Middleware centralizado para manejo de errores
 */

/**
 * Sanitiza los logs para evitar inyección de caracteres de control
 */
const sanitizeLog = (message) => {
  if (typeof message !== 'string') {
    return message;
  }
  // Elimina caracteres de control excepto saltos de línea y tabuladores
  return message.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * Logger seguro que sanitiza mensajes
 */
const safeLog = {
  error: (message, error) => {
    const sanitizedMessage = sanitizeLog(message);
    if (error) {
      console.error(sanitizedMessage, {
        message: sanitizeLog(error.message),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      console.error(sanitizedMessage);
    }
  },
  warn: (message) => {
    console.warn(sanitizeLog(message));
  },
  info: (message) => {
    console.info(sanitizeLog(message));
  }
};

/**
 * Manejador de errores 404 - Página no encontrada
 */
const notFoundHandler = (req, res) => {
  safeLog.warn(`404 - Página no encontrada: ${req.originalUrl}`);
  
  // Si es una petición API, devolver JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      error: 'Endpoint no encontrado',
      path: req.originalUrl
    });
  }
  
  // Para rutas web, renderizar página de error
  res.status(404).render('error', {
    title: 'Página No Encontrada',
    message: 'La página que buscas no existe',
    error: { status: 404 }
  });
};

/**
 * Manejador centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  // Log seguro del error
  safeLog.error('Error en la aplicación:', err);
  
  // Determinar código de estado
  const statusCode = err.statusCode || err.status || 500;
  
  // Preparar mensaje de error
  let errorMessage = err.message || 'Ha ocurrido un error en el servidor';
  
  // En producción, no exponer detalles técnicos
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    errorMessage = 'Error interno del servidor';
  }
  
  // Información adicional solo en desarrollo
  const errorDetails = process.env.NODE_ENV === 'development' ? {
    stack: err.stack,
    details: err.details || null
  } : {};
  
  // Si es una petición API, devolver JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(statusCode).json({
      error: errorMessage,
      ...errorDetails
    });
  }
  
  // Para rutas web, renderizar página de error
  res.status(statusCode).render('error', {
    title: 'Error',
    message: errorMessage,
    error: {
      status: statusCode,
      ...errorDetails
    }
  });
};

/**
 * Manejador para errores de validación (express-validator)
 */
const validationErrorHandler = (errors) => {
  const formattedErrors = errors.array().map(err => ({
    field: err.param || err.path,
    message: err.msg,
    value: err.value
  }));
  
  const error = new Error('Errores de validación');
  error.statusCode = 400;
  error.details = formattedErrors;
  
  return error;
};

/**
 * Wrapper para controladores asíncronos
 * Captura errores automáticamente sin necesidad de try-catch
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Manejador de errores de base de datos
 */
const databaseErrorHandler = (error) => {
  safeLog.error('Error de base de datos:', error);
  
  // Errores comunes de Supabase/PostgreSQL
  if (error.code === '23505') {
    // Violación de unique constraint
    const err = new Error('El registro ya existe');
    err.statusCode = 409;
    return err;
  }
  
  if (error.code === '23503') {
    // Violación de foreign key
    const err = new Error('Referencia inválida a otro registro');
    err.statusCode = 400;
    return err;
  }
  
  if (error.code === '23502') {
    // Violación de not null
    const err = new Error('Faltan campos requeridos');
    err.statusCode = 400;
    return err;
  }
  
  // Error genérico de base de datos
  const err = new Error('Error al procesar la solicitud en la base de datos');
  err.statusCode = 500;
  return err;
};

module.exports = {
  notFoundHandler,
  errorHandler,
  validationErrorHandler,
  asyncHandler,
  databaseErrorHandler,
  safeLog
};
