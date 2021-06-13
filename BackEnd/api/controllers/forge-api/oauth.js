const https = require('https');
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    async authenticate(req, res){
        const client_data = {
            client_id: '8bqK6hofASylpd1YSBkUbveFGJlAPgg1',
            client_secret: 'fdHMGRDKZsJjzJ9J',
            grant_type: 'client_credentials',
            scope: 'bucket:create bucket:read data:read data:create data:write'
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        
        
        try{
            const request = await https.request('https://developer.api.autodesk.com/authentication/v1/authenticate',options, function(res){
                res.on('data', function(chunk){
                    console.log(chunk)
                })
            })

            
            request.on('error', e => {
                res.status(400).json(e)
            })

            request.write(client_data)
            request.end()
            
        }catch(err){
            res.send(err)
        }

    },
    test(req, res){
        res.status(200).json({
            message: 'Handling POST requests to /forge'
        });
    }
}