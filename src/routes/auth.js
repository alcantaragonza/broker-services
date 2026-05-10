const { Router } = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { resolveServiceUrl } = require("../config");
const validate = require("../middlewares/validator");
const { auth: authSchemas } = require("../validators/schemas");
const { success, error } = require("../utils/responses");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = Router();

const ROLE_REGISTER_ROUTES = {
  admin: "/admin/register",
  restaurante: "/restaurants/register",
  repartidor: "/couriers/register",
  cliente: "/client/register",
};

const ROLE_REGISTER_ROUTES_BY_ID = {
  1: "/admin/register",
  2: "/restaurants/register",
  3: "/couriers/register",
  4: "/client/register",
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
        `${adminUrl}/auth/login`,
        req.body,
        { timeout: 8000 },
      );
      const userData = response.data?.data || response.data;

      if (!userData) return error(res, "Credenciales inválidas", 401);

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

      if (err.response?.status === 401 || err.response?.status === 404)
        return error(res, "Credenciales inválidas", 401);

      return error(res, "Error al autenticar", 500);
    }
  },
);

router.post(
  "/register",
  authLimiter,
  async (req, res) => {
    try {
      const rawRol = req.body.rol;

      // Normalizar: si es string, quitar espacios y pasar a minúsculas
      const rolNormalizado =
        typeof rawRol === "string" ? rawRol.trim().toLowerCase() : rawRol;

      // Buscar ruta por nombre o por ID (acepta número o string numérico)
      const registerPath =
        ROLE_REGISTER_ROUTES[rolNormalizado] ||
        ROLE_REGISTER_ROUTES_BY_ID[Number(rawRol)] ||
        ROLE_REGISTER_ROUTES_BY_ID[rawRol];

      if (!registerPath)
        return error(res, "Rol no válido o no especificado", 400);

      const adminUrl = resolveServiceUrl("administracion");
      if (!adminUrl)
        return error(res, "Servicio de administración no disponible", 503);

      const response = await axios.post(
        `${adminUrl}${registerPath}`,
        req.body,
        { timeout: 8000 },
      );

      console.log("Respuesta del servicio de administración:", response.data);

      const userData = response.data?.data || response.data;

      // Validar payload antes de firmar el JWT
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
        201,
        "Usuario registrado exitosamente",
      );
    } catch (err) {
      console.error("Error en /register:", err.response?.data || err.message);
      if (err.response?.status === 409)
        return error(res, "El usuario ya existe", 409);
      if (err.code === "ECONNABORTED")
        return error(res, "Servicio no responde", 504);
      return error(res, "Error al registrar usuario", 500);
    }
  },
);

router.post(
  "/refresh",
  authLimiter,
  async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return error(res, "Token de autorización requerido", 401);

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        ignoreExpiration: true,
      });
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, rol: decoded.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
      );
      return success(res, { token: newToken }, 200, "Token renovado");
    } catch (err) {
      return error(res, "Token inválido", 401);
    }
  },
);

module.exports = router;