const express = require('express')
const db = require('./db/db')
const queries = require('./db/queryList')

module.exports = {
    async getPlanificacion(req, res){
        try{
            const query = await db.query(queries.getPlanificacion)
            res.send(query.rows)
        }catch(err){
            res.send(err)
        }
        
    },
    updatePlanificacion(req, res){

    }
}