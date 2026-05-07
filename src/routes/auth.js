const { Router } = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { resolveServiceUrl } = require('../config');
const validate = require('../middlewares/validator');
const { auth: authSchemas } = require('../validators/schemas');
const { success, error } = require('../utils/responses');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = Router();

router.post('/login', authLimiter, validate(authSchemas.login), async (req, res) => {
  try {
    const adminUrl = resolveServiceUrl('administracion');
    if (!adminUrl) return error(res, 'Servicio de administración no disponible', 503);

    const response = await axios.post(`${adminUrl}/api/auth/login`, req.body, { timeout: 8000 });
    const userData = response.data?.data || response.data;

    if (!userData) return error(res, 'Credenciales inválidas', 401);

    const token = jwt.sign(
      {
        id: userData.id || userData.id_usuario,
        email: userData.email,
        rol: userData.rol || userData.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return success(res, { token, usuario: userData }, 200, 'Autenticación exitosa');
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 404) {
      return error(res, 'Credenciales inválidas', 401);
    }
    return error(res, 'Error al autenticar', 500);
  }
});

router.post('/register', authLimiter, validate(authSchemas.register), async (req, res) => {
  try {
    const adminUrl = resolveServiceUrl('administracion');
    if (!adminUrl) return error(res, 'Servicio de administración no disponible', 503);

    const response = await axios.post(`${adminUrl}/api/auth/register`, req.body, { timeout: 8000 });
    const userData = response.data?.data || response.data;

    const token = jwt.sign(
      {
        id: userData.id || userData.id_usuario,
        email: userData.email,
        rol: userData.rol || userData.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return success(res, { token, usuario: userData }, 201, 'Usuario registrado exitosamente');
  } catch (err) {
    if (err.response?.status === 409) return error(res, 'El usuario ya existe', 409);
    return error(res, 'Error al registrar usuario', 500);
  }
});

module.exports = router;