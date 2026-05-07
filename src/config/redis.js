const Redis = require('ioredis');
const logger = require('../utils/logger');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis.on('connect', () => logger.info('Redis conectado'));
redis.on('error', (err) => logger.error('Redis error', { message: err.message }));

module.exports = redis;