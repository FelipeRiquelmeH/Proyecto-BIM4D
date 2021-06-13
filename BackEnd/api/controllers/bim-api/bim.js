const https = require('https')
const db = require('./db/db')
const queries = require('./db/queryList')

module.exports = {
    async getObjectRelations(req, res){
        try{
            const query = await db.query('')
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
            const query = await db.query(queries.crearAvance,[idTarea, idObjeto])

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
            const query = await db.query(queries.eliminarAvance,[idAvance])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    }
}