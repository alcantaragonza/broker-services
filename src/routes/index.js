const { Router } = require('express');
const { resolveServiceUrl } = require('../config');
const { safeForward } = require('../services/forwarder');
const { enqueue } = require('../queue/producer');
const { restaurantes: rSchemas, logistica: lSchemas } = require('../validators/schemas');
const { error } = require('../utils/responses');
const logger = require('../utils/logger');

const router = Router();

const SCHEMA_MAP = {
  'POST:/restaurantes':                                          rSchemas.crear,
  'PUT:/restaurantes/:id':                                       rSchemas.actualizar,
  'PATCH:/restaurantes/:id/disponibilidad':                      rSchemas.disponibilidad,
  'POST:/restaurantes/:id/horarios':                             rSchemas.crearHorario,
  'PUT:/restaurantes/:id/horarios/:hid':                         rSchemas.actualizarHorario,
  'POST:/restaurantes/:id/productos':                            rSchemas.crearProducto,
  'PUT:/restaurantes/:id/productos/:pid':                        rSchemas.actualizarProducto,
  'PUT:/restaurantes/:id/productos/:pid/precio':                 rSchemas.actualizarPrecio,
  'POST:/restaurantes/:id/combos':                               rSchemas.crearCombo,
  'POST:/restaurantes/:id/combos/:cid/productos':                rSchemas.agregarProductosCombo,
  'POST:/restaurantes/:id/pedidos':                              rSchemas.crearPedido,
  'PUT:/restaurantes/:id/pedidos/:pid/estado':                   rSchemas.cambiarEstadoPedido,
  'POST:/restaurantes/:id/pedidos/:pid/detalles':                rSchemas.agregarItemPedido,
  'POST:/restaurantes/:id/pedidos/:pid/cancelacion/cancelar':    rSchemas.cancelarPedido,
  'POST:/logistica/entregas':                                    lSchemas.crearEntrega,
  'PUT:/logistica/entregas/:id':                                 lSchemas.actualizarEntrega,
  'PATCH:/logistica/entregas/:id/estado':                        lSchemas.cambiarEstadoEntrega,
  'PATCH:/logistica/entregas/:id/cancelar':                      lSchemas.cancelarEntrega,
  'POST:/logistica/asignaciones':                                lSchemas.asignarRepartidor,
  'PUT:/logistica/asignaciones/entrega/:id':                     lSchemas.reasignarRepartidor,
  'DELETE:/logistica/asignaciones/entrega/:id':                  lSchemas.desasignarRepartidor,
  'POST:/logistica/incidencias':                                 lSchemas.crearIncidencia,
  'PUT:/logistica/incidencias/:id':                              lSchemas.actualizarIncidencia
};

const SERVICE_MAP = {
  restaurantes:     'restaurantes',
  'estados-pedido': 'restaurantes',
  logistica:        'logistica',
  administracion:   'administracion',
  cobros:           'cobros',
  descuentos:       'descuentos',
  negocios:         'negocios',
  paqueteria:       'paqueteria',
  soporte:          'soporte',
  contabilidad:     'contabilidad',
  chat:             'chat',
  bancario:         'bancario'
};

const resolveService = (apiPath) => {
  const segment = apiPath.split('/')[1];
  return SERVICE_MAP[segment] || null;
};

const findSchema = (method, path) => {
  for (const [pattern, schema] of Object.entries(SCHEMA_MAP)) {
    const colonIdx = pattern.indexOf(':');
    const pMethod = pattern.substring(0, colonIdx);
    const pPath   = pattern.substring(colonIdx + 1);
    if (pMethod !== method) continue;
    const regexStr = pPath.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${regexStr}$`);
    if (regex.test(path)) return schema;
  }
  return null;
};

const isMutation = (method) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

router.all('/*', async (req, res) => {
  const apiPath = req.path;
  const method  = req.method;

  const serviceName = resolveService(apiPath);
  if (!serviceName) return error(res, `Servicio no encontrado para: ${apiPath}`, 404);

  const serviceBaseUrl = resolveServiceUrl(serviceName);
  if (!serviceBaseUrl) return error(res, `Servicio '${serviceName}' no configurado`, 503);

  const targetUrl = `${serviceBaseUrl}/api${apiPath}`;

  if (isMutation(method) && req.body && Object.keys(req.body).length > 0) {
    const schema = findSchema(method, apiPath);
    if (schema) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
        logger.warn('Validación fallida', { method, path: apiPath });
        return error(res, 'Datos de entrada inválidos', 400, errors);
      }
      req.body = result.data;
    }
  }

  logger.debug('Forwarding', { method, targetUrl });

  if (!isMutation(method)) {
    try {
      const result = await safeForward({ method, targetUrl, headers: req.headers, params: req.query });
      return res.status(result.status).json(result.data);
    } catch (err) {
      return error(res, err.message || 'Error interno', err.status || 500);
    }
  }

  try {
    await enqueue({
      method,
      targetUrl,
      data: req.body,
      headers: { authorization: req.headers['authorization'], 'content-type': 'application/json' },
      params: req.query
    });

    const result = await safeForward({ method, targetUrl, data: req.body, headers: req.headers, params: req.query });
    return res.status(result.status).json(result.data);
  } catch (err) {
    return error(res, err.message || 'Error procesando la petición', err.status || 500);
  }
});

module.exports = router;