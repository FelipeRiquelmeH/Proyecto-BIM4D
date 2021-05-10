const { AuthClientTwoLegged } = require('forge-apis');

const config = require('../../config');
/**
 * Inicializa un cliente Forge para autentificación 2L (Two-legged)
 * @param {string[]} scopes Lista de permisos de acceso a recursos
 * @returns Cliente de autentificación 2L
 */
function getClient(scopes){
    const { client_id, client_secret } = config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal);
}

let cache = new Map();
async function getToken(scopes){
    const key = scopes.join('+');
    if(cache.has(key) && cache.get(key).expires_at > Date.now()){
        return cache.get(key)
    }
    const client = getClient(scopes)
    let credentials = await client.authenticate();
    credentials.expires_at = Date.now() + credentials.expires_in * 1000;
    cache.set(key, credentials);
    return credentials;
}

/**
 * Obtiene token de autentificación 2L para permisos publicos preconfigurados
 * @returns Objeto Token: { "access_token":"...", "expires_at": "...", "expires_in": "...", "token_type": "..."}.
 */
async function getPublicToken(){
    return getToken(config.scopes.public);
}

/**
 * Obtiene token de autentificación 2L para permisos internos preconfigurados
 * @returns Objeto Token: { "access_token":"...", "expires_at": "...", "expires_in": "...", "token_type": "..."}.
 */
async function getInternalToken(){
    return getToken(config.scopes.internal);
}

module.exports = {
    getClient,
    getPublicToken,
    getInternalToken
};