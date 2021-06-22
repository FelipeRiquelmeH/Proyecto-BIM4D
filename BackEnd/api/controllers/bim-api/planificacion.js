const { response } = require('express')
const express = require('express')
const db = require('./db/db')
const queries = require('./db/queryList')

module.exports = {
    async getPlanificacion(req, res){
        try{
            const idPlanificacion = req.body.idPlanificacion
            const query = await db.query(queries.obtenerPlanificacion, [idPlanificacion])

            res.send(query.rows)
            return 200
        }catch(err){
            return err
        }
    },
    async actualizarTarea(req, res){
        try{
            const idTarea = req.body[0].idTarea
            const finReal = req.body[0].finReal
            
            const query = await db.query(queries.actualizarTarea, [idTarea,finReal])

            let response
            if(query.rows.length){
                response = {
                    status: 1,
                    message: 'La tarea ' + idTarea + ' ha sido actualizada!'
                }
            }else{
                response = {
                    status: 0,
                    message: 'La tarea ' + idTarea + ' no ha podido ser completada'
                }
            }

            res.send([response])
            return 200
        }catch(err){
            return err
        }
    },
    async actualizarTareas(req, res){
        try{
            const tareas = req.body.tareas
            const fechas = req.body.fechas

            const query = await db.query(queries.actualizarTareas, [tareas, fechas])

            let responses = []
            if(query.rows.length){
                for(let i = 0; i < query.rows.length; i++){
                    let response = {
                        status: 1,
                        message: 'La tarea ' + query.rows[i]['id_tarea'] + ' ha sido actualizada!'
                    }
                    responses.push(response)
                }
            }else{
                let response = {
                    status: 0,
                    message: 'La tareas no han podido ser completada'
                }
                responses.push(response)
            }

            res.send(responses)
            return 200
        }catch(err){
            return err
        }
    },
    async deshacerTarea(req, res){
        try{
            const idTarea = req.body.idTarea
            const query = await db.query(queries.deshacerTarea,[idTarea])

            let responses = []
            if(query.rows.length){
                for(let i = 0; i < query.rows.length; i++){
                    let response = {
                        status: 1,
                        message: 'La tarea ' + idTarea + ' se deshizo exitosamente!'
                    }
                    responses.push(response)
                }
            }else{
                let response = {
                    status: 0,
                    message: 'La tarea ' + idTarea + ' no se ha podido deshacer'
                }
                responses.push(response)
            }

            res.send(responses)
            return 200
        }catch(err){
            return err
        }
    },
    async deshacerTareas(req, res){
        try {
            const idTareas = req.body.idTareas
            const query = await db.query(queries.deshacerTareas, [idTareas])

            let responses = []
            if(query.rows){
                for(let i = 0; i < query.rows.length; i++){
                    let response = {
                        status: 1,
                        message: 'La tarea ' + query.rows[i]['id_tarea'] + ' se deshizo exitosamente!'
                    }
                    responses.push(response)
                }
            }else{
                let response = {
                    status: 0,
                    message: 'La tarea ' + idTarea + ' no se ha podido deshacer'
                }
                responses.push(response)
            }
            res.send(responses)
            return 200
        } catch (err) {
            return err
        }
    }
}