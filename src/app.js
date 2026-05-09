require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./utils/logger');
const { error } = require('./utils/responses');
const { globalLimiter } = require('./middlewares/rateLimiter');
const authMiddleware = require('./middlewares/auth');
const authRoutes = require('./routes/auth');
const apiRouter = require('./routes/index');

require('./queue/worker');

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(globalLimiter);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Broker Pedidos Now activo', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
// app.use('/api', authMiddleware, apiRouter);
app.use('/api', apiRouter);

app.use((req, res) => {
  error(res, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404);
});

app.use((err, req, res, _next) => {
  logger.error('Error no controlado', { message: err.message, stack: err.stack });
  error(res, 'Error interno del servidor', 500);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Broker Pedidos Now corriendo en puerto ${PORT}`);
});

module.exports = app;