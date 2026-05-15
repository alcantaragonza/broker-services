const { Router } = require("express");
const { resolveServiceUrl, services } = require("../config");
const { safeForward } = require("../services/forwarder");
const { enqueue } = require('../queue/producer');
const worker = require('../queue/worker');
const {
  restaurantes: rSchemas,
  logistica: lSchemas,
  paqueteria: pSchemas,
  cobros: cSchemas,
  chats: chSchemas,
  chatAutomatizado: caSchemas,
} = require("../validators/schemas");
const { error } = require("../utils/responses");
const logger = require("../utils/logger");

const router = Router();

const SCHEMA_MAP = {
  // RESTAURANTES
  "POST:/restaurantes": rSchemas.crear,
  "PUT:/restaurantes/:id": rSchemas.actualizar,
  "PATCH:/restaurantes/:id/disponibilidad": rSchemas.disponibilidad,
  "POST:/restaurantes/:id/horarios": rSchemas.crearHorario,
  "PUT:/restaurantes/:id/horarios/:hid": rSchemas.actualizarHorario,
  "POST:/restaurantes/:id/productos": rSchemas.crearProducto,
  "PUT:/restaurantes/:id/productos/:pid": rSchemas.actualizarProducto,
  "PUT:/restaurantes/:id/productos/:pid/precio": rSchemas.actualizarPrecio,
  "POST:/restaurantes/:id/combos": rSchemas.crearCombo,
  "POST:/restaurantes/:id/combos/:cid/productos":
    rSchemas.agregarProductosCombo,
  "POST:/restaurantes/:id/pedidos": rSchemas.crearPedido,
  "PUT:/restaurantes/:id/pedidos/:pid/estado": rSchemas.cambiarEstadoPedido,
  "POST:/restaurantes/:id/pedidos/:pid/detalles": rSchemas.agregarItemPedido,
  "POST:/restaurantes/:id/pedidos/:pid/cancelacion/cancelar":
    rSchemas.cancelarPedido,
  // LOGISTICA
  // ── Entregas ─────────────────────────────────────────────────────────────────
  "POST:/logistica/entregas":
    lSchemas.crearEntrega,
  "POST:/logistica/entregas/restaurantes/:restaurante_id/pedidos/:pedido_id":
    lSchemas.crearEntrega,           // body vacío desde el pedido ya existente — schema permisivo
  "PUT:/logistica/entregas/:id":
    lSchemas.actualizarEntrega,
  "PATCH:/logistica/entregas/:id/estado":
    lSchemas.cambiarEstadoEntrega,
  "PATCH:/logistica/entregas/:id/cancelar":
    lSchemas.cancelarEntrega,
  "PATCH:/logistica/entregas/:id/recogida":
    lSchemas.recogidaEntrega,
  "PATCH:/logistica/entregas/:id/entregada":
    lSchemas.entregadaEntrega,
  // ── Asignaciones ─────────────────────────────────────────────────────────────
  "POST:/logistica/asignaciones":
    lSchemas.asignarRepartidor,
  "PUT:/logistica/asignaciones/entrega/:id":
    lSchemas.reasignarRepartidor,
  "DELETE:/logistica/asignaciones/entrega/:id":
    lSchemas.desasignarRepartidor,
  // ── Incidencias ───────────────────────────────────────────────────────────────
  "POST:/logistica/incidencias":
    lSchemas.crearIncidencia,
  "PUT:/logistica/incidencias/:id":
    lSchemas.actualizarIncidencia,
  "PATCH:/logistica/incidencias/:id/resolver":
    lSchemas.resolverIncidencia,
  "PATCH:/logistica/incidencias/:id/reabrir":
    lSchemas.reabrirIncidencia,
  // ── Repartidores ──────────────────────────────────────────────────────────────
  "PATCH:/logistica/repartidores/me/ubicacion":
    lSchemas.actualizarUbicacion,
  "PATCH:/logistica/repartidores/me/estado":
    lSchemas.actualizarEstadoRepartidor,
  // ── Categorias ────────────────────────────────────────────────────────────────
  "POST:/logistica/categorias":
    lSchemas.crearCategoria,
  "PUT:/logistica/categorias/:id":
    lSchemas.actualizarCategoria,
  "PATCH:/logistica/categorias/:id/toggle":
    lSchemas.toggleCategoria,
  // ── Feed ──────────────────────────────────────────────────────────────────────
  "PATCH:/logistica/feed/:id/aceptar":
    lSchemas.aceptarPedidoFeed,
  // PAQUETERIA
  //USERS (/paqueteria/users
  'POST:/paqueteria/users': pSchemas.crearUsuario,
  'PUT:/paqueteria/users/:id': pSchemas.actualizarUsuario,
  //COURIERS (/paqueteria/couriers
  'POST:/paqueteria/couriers': pSchemas.crearCourier,
  'PUT:/paqueteria/couriers/:id': pSchemas.actualizarCourier,
  'PUT:/paqueteria/couriers/:id/status': pSchemas.cambiarEstadoCourier,
  //ADDRESSES (/paqueteria/addresses
  'POST:/paqueteria/addresses': pSchemas.crearDireccion,
  'PUT:/paqueteria/addresses/:id': pSchemas.actualizarDireccion,
  //PRICES (/paqueteria/prices
  'POST:/paqueteria/prices': pSchemas.crearPrecio,
  'PUT:/paqueteria/prices/:id': pSchemas.actualizarPrecio,
  //SHIPMENTS (/paqueteria/shipments
  'POST:/paqueteria/shipments': pSchemas.crearEnvio,
  'PUT:/paqueteria/shipments/:id': pSchemas.actualizarEnvio,
  //PACKAGES (/paqueteria/packages
  'POST:/paqueteria/packages': pSchemas.crearPaquete,
  'PUT:/paqueteria/packages/:id': pSchemas.actualizarPaquete,
  //COURIER STATUS TYPES (/paqueteria/courier-status-types
  'POST:/paqueteria/courier-status-types': pSchemas.crearTipoEstado,
  'PUT:/paqueteria/courier-status-types/:id': pSchemas.actualizarTipoEstado,
  //COURIER STATUSES (/paqueteria/courier-statuses
  'POST:/paqueteria/courier-statuses': pSchemas.crearRegistroEstado,
  'PUT:/paqueteria/courier-statuses/:id': pSchemas.actualizarRegistroEstado,

  //COBROS
  "POST:/payments/calculate": cSchemas.calcularTotal,
  "POST:/payments": cSchemas.crearPago,
  "POST:/wallet/pay-pending": cSchemas.pagarPendiente,

  //CHAT SERVICIO AL CLIENTE
    // Horarios de atencion
  "POST:/availability": chSchemas.crearHorario,
  "PATCH:/availability/:id": chSchemas.actualizarHorario,
   // Conversaciones
  "POST:/conversations": chSchemas.crearConversacion,
   // Mensajes
  "POST:/conversations/:id/messages": chSchemas.enviarMensaje,
   // Asignacion de agente (URL pendiente de confirmar con backend)
  "PATCH:/conversations/:id/agent": chSchemas.asignarAgente,
   // Cambio de estado / cierre
  "PATCH:/conversations/:id/status": chSchemas.cambiarEstado,
   // Jobs internos
  "POST:/internal/conversations/close-timeouts": chSchemas.cerrarPorInactividad,

  //CHAT AUTOMATIZADO (soporte)
  // Sesiones
  "POST:/soporte/session":                caSchemas.iniciarSesion,
  "POST:/soporte/session/message":        caSchemas.enviarMensaje,
  // FAQs
  "POST:/soporte/faqs":                   caSchemas.crearFaq,
  "PATCH:/soporte/faqs/:id":              caSchemas.actualizarFaq,
  // Solicitudes de soporte
  "PATCH:/soporte/support/:id/status":    caSchemas.actualizarSolicitud,
  // Escalaciones
  "PATCH:/soporte/escalation/:id/status": caSchemas.actualizarEscalacion,
};

const SERVICE_MAP = {
  restaurantes: "restaurantes",
  "estados-pedido": "restaurantes",
  logistica: "logistica",
  administracion: "administracion",
  cobros: "cobros",
  descuentos: "descuentos",
  negocios: "negocios",
  paqueteria: "paqueteria",
  soporte: "soporte",
  contabilidad: "contabilidad",
  chat: "chat",
  bancario: "bancario",
};

const resolveService = (apiPath) => {
  const segment = apiPath.split("/")[1];
  return SERVICE_MAP[segment] || null;
};

const findSchema = (method, path) => {
  for (const [pattern, schema] of Object.entries(SCHEMA_MAP)) {
    const colonIdx = pattern.indexOf(":");
    const pMethod = pattern.substring(0, colonIdx);
    const pPath = pattern.substring(colonIdx + 1);
    if (pMethod !== method) continue;
    const regexStr = pPath.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${regexStr}$`);
    if (regex.test(path)) return schema;
  }
  return null;
};

const isMutation = (method) =>
  ["POST", "PUT", "PATCH", "DELETE"].includes(method);

const JOB_TIMEOUT = 15000;

const waitForJob = (jobId) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      worker.removeListener('completed', onCompleted);
      worker.removeListener('failed', onFailed);
      reject({ status: 504, message: 'Tiempo de espera agotado' });
    }, process.env.JOB_TIMEOUT || JOB_TIMEOUT);

    const onCompleted = (job, result) => {
      if (String(job.id) !== String(jobId)) return;
      clearTimeout(timeout);
      worker.removeListener('completed', onCompleted);
      worker.removeListener('failed', onFailed);
      resolve(result);
    };

    const onFailed = (job, err) => {
      if (String(job?.id) !== String(jobId)) return;
      clearTimeout(timeout);
      worker.removeListener('completed', onCompleted);
      worker.removeListener('failed', onFailed);
      reject({ status: 502, message: err.message || 'Error procesando la petición' });
    };

    worker.on('completed', onCompleted);
    worker.on('failed', onFailed);
  });

router.all("/{*splat}", async (req, res) => {
  const apiPath = req.path;
  const method = req.method;

  const serviceName = resolveService(apiPath);
  if (!serviceName)
    return error(res, `Servicio no encontrado para: ${apiPath}`, 404);

  const serviceBaseUrl = resolveServiceUrl(serviceName);
  if (!serviceBaseUrl)
    return error(res, `Servicio '${serviceName}' no configurado`, 503);

  const serviceConfig = services[serviceName];
  const targetPath = serviceConfig?.pathTransform ? serviceConfig.pathTransform(apiPath) : `/api${apiPath}`;
  const targetUrl = `${serviceBaseUrl}${targetPath}`;

  if (isMutation(method) && req.body && Object.keys(req.body).length > 0) {
    const schema = findSchema(method, apiPath);
    if (schema) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        logger.warn("Validación fallida", { method, path: apiPath });
        return error(res, "Datos de entrada inválidos", 400, errors);
      }
      req.body = result.data;
    }
  }

  logger.debug("Forwarding", { method, targetUrl });

  if (!isMutation(method)) {
    try {
      const result = await safeForward({
        method,
        targetUrl,
        headers: req.headers,
        params: req.query,
      });
      return res.status(result.status).json(result.data);
    } catch (err) {
      return error(res, err.message || "Error interno", err.status || 500);
    }
  }

  try {
    const jobId = await enqueue({
      method,
      targetUrl,
      data: req.body,
      headers: {
        authorization: req.headers["authorization"],
        "content-type": "application/json",
      },
      params: req.query,
    });

    // Fix: Solo espera que el worker termine — él ya hace el forward
    const result = await waitForJob(jobId);
    return res.status(result.status).json(result.data);
  } catch (err) {
    return error(
      res,
      err.message || "Error procesando la petición",
      err.status || 500,
    );
  }
});

module.exports = router;
