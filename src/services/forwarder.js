const axios = require('axios');
const logger = require('../utils/logger');

const forwardRequest = async ({ method, targetUrl, data, headers, params }) => {
  const allowedHeaders = {};
  if (headers['authorization']) allowedHeaders['authorization'] = headers['authorization'];
  if (headers['content-type']) allowedHeaders['content-type'] = headers['content-type'];

  const response = await axios({
    method,
    url: targetUrl,
    data: data || undefined,
    params: params || undefined,
    headers: allowedHeaders,
    timeout: 10000
  });

  return { status: response.status, data: response.data };
};

const safeForward = async (options) => {
  try {
    return await forwardRequest(options);
  } catch (err) {
    if (err.response) {
      logger.warn('Microservicio respondió con error', {
        url: options.targetUrl,
        status: err.response.status
      });
      return { status: err.response.status, data: err.response.data };
    }
    logger.error('Microservicio no disponible', { url: options.targetUrl, message: err.message });
    throw { status: 503, message: 'Servicio temporalmente no disponible' };
  }
};

module.exports = { safeForward };