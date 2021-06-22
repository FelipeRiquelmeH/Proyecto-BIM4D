const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Jo')
    res.json('Hello World')}
    )

//Forge API Controllers
const forgeOAuthController = require('../controllers/forge-api/oauth')
const forgeBucketController = require('../controllers/forge-api/bucket')
const forgeObjectController = require('../controllers/forge-api/object')

//BIM Module API Controllers
const planificacionController = require('../controllers/bim-api/planificacion')
const bimController = require('../controllers/bim-api/bim')

/**
 * Forge API calls
 */
router.get('/forge/authenticate',forgeOAuthController.authenticate)
router.get('/forge/buckets/get', forgeBucketController.getBuckets)
router.post('/forge/buckets/create', forgeBucketController.createBucket)
router.get('/forge/objects/get', forgeObjectController.getObjects)
router.put('/forge/objects/upload', forgeObjectController.uploadFile)
router.post('/forge/objects/translate', forgeObjectController.translateFile)
router.get('/forge/objects/checkProgress', forgeObjectController.checkTranslationProgress)

router.get('/forge',forgeOAuthController.test)
/**
 * BIM module API calls
 */
//Planificacion calls
router.post('/planificacion/get',planificacionController.getPlanificacion)
router.post('/planificacion/update', planificacionController.actualizarTarea)
router.post('/planificacion/updateMult', planificacionController.actualizarTareas)
router.post('/planificacion/undoMult', planificacionController.deshacerTareas)
router.post('/planificacion/undo',planificacionController.deshacerTarea)
//BIM calls
router.post('/bim/get', bimController.getObjectRelations)
router.post('/bim/create', bimController.createRelation)
router.post('/bim/update', bimController.updateObjectRelations)
router.post('/bim/delete', bimController.deleteRelation)

module.exports = router