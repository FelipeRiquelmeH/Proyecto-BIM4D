const https = require('https')

module.exports = {
    getObjects(req, res){
        const options = {
            hostname: 'https://developer.api.autodesk.com',
            port: 3000,
            path: '/oss/v2/buckets' + req.body.bucketKey + '/objects',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token
            }
        }

        const request = https.request(options, res => {
            res.on('data', (d) => {
                console.log(d)
            })
        })

        request.on('error', (error) => {
            console.error(error)
        })

        request.end()
    },
    uploadFile(req, res){
        const options = {
            hostname: 'https://developer.api.autodesk.com',
            port: 3000,
            path: '/oss/v2/buckets' + req.body.bucketKey + '/objects/' + req.body.objectKey,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token
            }
        }

        const request = https.request(options, res => {
            res.on('data', (d) => {
                console.log(d)
            })
        })
        
        request.on('error', (error) => {
            console.error(error)
        })

        request.write(req.body.model)
        request.end()
    },
    translateFile(req, res){
        const options = {
            hostname: 'https://developer.api.autodesk.com',
            port: 3000,
            path: 'modelderivative/v2/designdata/job',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token,
                'Content-Type': 'application/json',
                'x-ads-force':'true'
            }
        }

        const body = {
            "input": {
                "urn": urn,
                "rootFilename": filename,
                "compressedUrn": true
            },
            "output": {
                "destination": {
                    "region": "us"
                },
                "formats": [
                    {
                        "type": "svf",
                        "views": [
                            "2d",
                            "3d"
                        ]
                    }
                ]
            }
        }

        const request = https.request(options, res => {
            res.on('data', (d) => {
                console.log(d)
            })
        })

        request.on('error', (error) => {
            console.error(error)
        })

        request.write(body)
        request.end()
    },
    checkTranslationProgress(req, res){
        const options = {
            hostname: 'https://developer.api.autodesk.com',
            port: 3000,
            path: 'modelderivative/v2/modelderivative/v2/designdata/' + req.body.safeUrn + '/manifest',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token,
            }
        }

        const request = https.request(options, res => {
            res.on('data', (d) => {
                console.log(d)
            })
        })

        request.end()
    }
}