const express = require('express');
const router = express.Router();

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
router.post('/forge/authenticate',forgeOAuthController.authenticate)
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
router.get('/planificacion/get',planificacionController.getPlanificacion)
// router.post('/planificacion/update',planificacionController.updatePlanificacion)
// router.get('/bim/getModel',bimController.getBIM)
// router.get('/bim/getRelations', bimController.getObjectRelations)
// router.post('/bim/updateRelations',bimController.updateObjectRelations)

module.exports = router