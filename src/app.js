const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const logger = require('./lib/logger');
const traceMiddleware = require('./lib/traceMiddleware');
const responseLogger = require('./lib/responseLogger');

const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(express.json());
app.use(traceMiddleware);
app.use(responseLogger);

app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);


app.use((err, req, res, next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack, traceId: req.traceId });
  res.status(500).json({ message: err.message || 'Bir hata oluştu', traceId: req.traceId });
});

module.exports = app;
