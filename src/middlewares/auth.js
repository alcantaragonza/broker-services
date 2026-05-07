const jwt = require('jsonwebtoken');
const { error } = require('../utils/responses');

const PUBLIC_ROUTES = [
  { method: 'POST', path: /^\/auth\/login$/ },
  { method: 'POST', path: /^\/auth\/register$/ },
  { method: 'GET',  path: /^\/health$/ }
];

const isPublic = (req) =>
  PUBLIC_ROUTES.some(r => r.method === req.method && r.path.test(req.path));

const authMiddleware = (req, res, next) => {
  if (isPublic(req)) return next();

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Token de autorización requerido', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expirado', 401);
    }
    return error(res, 'Token inválido', 401);
  }
};

module.exports = authMiddleware;