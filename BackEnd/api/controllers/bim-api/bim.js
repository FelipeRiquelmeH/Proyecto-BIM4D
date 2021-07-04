const https = require('https')
const db = require('./db/db')
const queries = require('./db/queryList')

module.exports = {
    async getObjects(req, res){
        try{
            const idPlanificacion = req.body.idPlanificacion
            const query = await db.query(queries.obtenerObjetos, [idPlanificacion])

            res.send(query.rows)

            return 200
        }catch(err){
            return err
        }
    },
    async getObjectRelations(req, res){
        try{
            const idPlanificacion = req.body.idPlanificacion
            const query = await db.query(queries.obtenerAvances, [idPlanificacion])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    },
    async createRelation(req, res){
        try{
            const idTarea = req.body.idTarea
            const idObjeto = req.body.idObjeto
            const tipoAvance = req.body.tipoAvance
            const query = await db.query(queries.crearAvances,[idTarea, idObjeto, tipoAvance])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    },
    async updateObjectRelations(req, res){
        try{
            const idTarea = req.body.idTarea
            const query = await db.query(queries.actualizarAvance,[idTarea])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    },
    async deleteRelation(req, res){
        try{
            const idAvance = req.body.idAvance
            const query = await db.query(queries.eliminarAvances,[idAvance])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    }
}