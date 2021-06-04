const express = require('express');
const app = express();

const planificacionRoute = require('./api/routes/planificacion');
const indexRouter = require('./api/routes/index');

app.use('/api', indexRouter);
app.use('/tareas',planificacionRoute);

module.exports = app;