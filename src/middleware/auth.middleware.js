const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Verificar si hay token en las cookies o en el header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso denegado. No se proporcionó token de autenticación.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token inválido o expirado.' 
    });
  }
};

module.exports = authMiddleware;
