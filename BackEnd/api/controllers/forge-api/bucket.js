const https = require('https')

module.exports = {
    getBuckets(req, res){
        const options = {
            hostname: 'https://developer.api.autodesk.com',
            port: 3000,
            path: '/oss/v2/buckets',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token
            }
        }

        const request = https.request(options, res => {
            res.on('data', d => {
                console.log(d)
            })
        })

        request.on('error', error => {
            console.error(error)
        })

        request.end();
    },
    createBucket(req, res){
        const options = {
            hostname: 'https://developer.api.autodesk.com',
            port: 3000,
            path: '/oss/v2/buckets',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token,
                'Content-Type': 'application/json'
            }
        }

        const body = {
            bucketKey: bucketKey,
            policyKey: 'transient'
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
    }
}