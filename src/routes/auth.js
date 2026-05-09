const { Router } = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { resolveServiceUrl } = require("../config");
const validate = require("../middlewares/validator");
const { auth: authSchemas } = require("../validators/schemas");
const { success, error } = require("../utils/responses");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = Router();

// Mapa de roles - (pendiente) endpoint de registro
const ROLE_REGISTER_ROUTES = {
  admin: "/api/admin/register",
  restaurante: "/api/restaurantes/register",
  repartidor: "/api/couriers/register",
  cliente: "/api/client/register",
};

// IDs numéricos si el body envía número (pendiente)
const ROLE_REGISTER_ROUTES_BY_ID = {
  1: "/api/admin/register",
  2: "/api/restaurantes/register",
  3: "/api/couriers/register",
  4: "/api/client/register",
};

router.post(
  "/login",
  authLimiter,
  validate(authSchemas.login),
  async (req, res) => {
    try {
      const adminUrl = resolveServiceUrl("administracion");
      if (!adminUrl)
        return error(res, "Servicio de administración no disponible", 503);

      const response = await axios.post(
        `${adminUrl}/api/auth/login`,
        req.body,
        { timeout: 8000 },
      );
      const userData = response.data?.data || response.data;

      if (!userData) return error(res, "Credenciales inválidas", 401);

      // Asegurarse que el payload del JWT siempre tenga valores definidos
      const id = userData.id ?? userData.id_usuario;
      const rol = userData.rol ?? userData.role;

      if (!id || !rol)
        return error(res, "Respuesta del servicio incompleta", 502);

      const token = jwt.sign(
        { id, email: userData.email, rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
      );

      return success(
        res,
        { token, usuario: userData },
        200,
        "Autenticación exitosa",
      );
    } catch (err) {
      if (err.code === "ECONNABORTED")
        return error(res, "Servicio no responde", 504);

      if (err.response?.status === 401 || err.response?.status === 404) {
        return error(res, "Credenciales inválidas", 401);
      }
      return error(res, "Error al autenticar", 500);
    }
  },
);

router.post(
  "/register",
  authLimiter,
  validate(authSchemas.register),
  async (req, res) => {
    try {
      const { rol } = req.body;

      // Resuelve la ruta según el rol (acepta nombre o ID)
      const registerPath =
        ROLE_REGISTER_ROUTES[rol] || ROLE_REGISTER_ROUTES_BY_ID[rol];

      if (!registerPath) {
        return error(res, "Rol no válido o no especificado", 400);
      }

      const adminUrl = resolveServiceUrl("administracion");
      if (!adminUrl)
        return error(res, "Servicio de administración no disponible", 503);

      const response = await axios.post(
        `${adminUrl}${registerPath}`,
        req.body,
        { timeout: 8000 },
      );

      const userData = response.data?.data || response.data;

      const token = jwt.sign(
        {
          id: userData.id || userData.id_usuario,
          email: userData.email,
          rol: userData.rol || userData.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
      );

      return success(
        res,
        { token, usuario: userData },
        201,
        "Usuario registrado exitosamente",
      );
    } catch (err) {
      if (err.response?.status === 409)
        return error(res, "El usuario ya existe", 409);
      return error(res, "Error al registrar usuario", 500);
    }
  },
);

module.exports = router;
