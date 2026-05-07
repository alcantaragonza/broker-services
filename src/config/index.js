require('dotenv').config();

const services = {
  restaurantes: require('./services/restaurantes'),
  logistica:    require('./services/logistica'),
  administracion: require('./services/administracion'),
  cobros:       require('./services/cobros'),
  descuentos:   require('./services/descuentos'),
  negocios:     require('./services/negocios'),
  paqueteria:   require('./services/paqueteria'),
  soporte:      require('./services/soporte'),
  contabilidad: require('./services/contabilidad'),
  chat:         require('./services/chat'),
  bancario:     require('./services/bancario')
};

const resolveServiceUrl = (serviceName) => {
  const svc = services[serviceName];
  if (!svc || !svc.baseUrl) return null;
  return svc.baseUrl;
};

module.exports = { services, resolveServiceUrl };
