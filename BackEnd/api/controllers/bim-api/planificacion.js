const express = require('express')
const db = require('./db/db')
const queries = require('./db/queryList')

module.exports = {
    async getPlanificacion(req, res){
        try{
            const idPlanificacion = req.body.idPlanificacion
            const query = await db.query(queries.getPlanificacion, [idPlanificacion])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    },
    async actualizarTarea(req, res){
        try{
            const idTarea = req.body.idTarea
            const finReal = req.body.finReal
            const query = await db.query(queries.actualizarTarea,[idTarea,finReal])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    },
    async deshacerTarea(req, res){
        try{
            const idTarea = req.body.idTarea
            const query = await db.query(queries.deshacerTarea,[idTarea])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    }
}