const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { BucketsApi, ObjectsApi, PostBucketsPayload } = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');
const config = require('../config');

let router = express.Router();

// Middleware para obtener un token por cada request
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

router.get('/buckets', async (req, res, next) => {
    const bucket_name = req.query.id;
    if(!bucket_name || bucket_name === '#') {
        try {
            const buckets = await new BucketsApi().getBuckets({limit: 100}, req.oauth_client, req.oauth_token);
            res.json(buckets.body.items.map((bucket) => {
                return {
                    id: bucket.bucketKey,
                    text: bucket.bucketKey.replace(config.credentials.client_id.toLowerCase() + '-', ''),
                    type: 'bucket',
                    children: true
                };
            }));
        } catch (error) {
            next(error);
        }
    } else{
        try {
            const objects = await new ObjectsApi().getObjects(bucket_name, {limit: 100}, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((object) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch (error) {
            next(error);
        }
    }
});

router.post('/buckets', async (req, res, next) => {
    let payload = new PostBucketsPayload();
    payload.bucketKey = config.credentials.client_id.toLowerCase() + '-' + req.body.bucketKey;
    payload.policyKey = 'transient';
    try {
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

router.post('objects', multer({ dest: 'uploads/'}).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if(err){
            next(err);
        }
        try {
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            res.status(200).end()
        } catch (error) {
            next(error);
        }
    });
});

module.exports = router;