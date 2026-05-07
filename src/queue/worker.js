const { Worker } = require('bullmq');
const { safeForward } = require('../services/forwarder');
const redis = require('../config/redis');
const logger = require('../utils/logger');

const worker = new Worker('mutations', async (job) => {
  const { method, targetUrl, data, headers, params } = job.data;
  logger.debug('Procesando job de mutación', { jobId: job.id, method, targetUrl });
  const result = await safeForward({ method, targetUrl, data, headers, params });
  return result;
}, {
  connection: redis,
  concurrency: 10
});

worker.on('completed', (job) => {
  logger.info('Job completado', { jobId: job.id });
});

worker.on('failed', (job, err) => {
  logger.error('Job fallido', { jobId: job?.id, error: err.message });
});

module.exports = worker;