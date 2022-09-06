const app = require('express')();
const router = require('./api/routes/routes');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');

const swaggerDocument = require('../swagger.json');
const { user_err } = require('./constants');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((err, req, res, next) => {
  if (!err) return next();
  return res.status(400).json({
    status: 400,
    messageError: 'Ops! Bad Request',
  });
});

app.use('/api', router);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((req, res, next) => {
  res.status(404).json({ status: 404, msg: user_err.err404 });
});

module.exports = app;
