const jwt = require('jsonwebtoken');

// Middleware para verificar si el token es válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });

    req.user = user; // user.ci y user.rol
    next();
  });
}

// Middleware para autorizar solo a ciertos roles
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Acceso denegado. Rol no autorizado' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};
