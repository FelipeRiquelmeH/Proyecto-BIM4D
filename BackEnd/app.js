const express = require('express');
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' == req.method){
        res.sendStatus(200);
    }else{
        next()
    }

})

const planificacionRoute = require('./api/routes/planificacion');
const indexRouter = require('./api/routes/index');

app.use('/api', indexRouter);
app.use('/tareas',planificacionRoute);

module.exports = app;