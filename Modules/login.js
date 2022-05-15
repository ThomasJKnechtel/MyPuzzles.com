import { OAuth2Client } from "google-auth-library";

/**
 * verify with google that token is valid
 * @param {Token} token the ID token to verify
 * @param {String} CLIENT_ID 
 * @param {Response} res 
 * @returns the google user_id of user
 */
const verify = async function(token, CLIENT_ID) {
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return userid
}
/**
 * 
 * @param {String} CLIENT_ID 
 * @param {Response} res 
 * @returns the google user_id of user
 */
const checkAuthenticated = async function(CLIENT_ID){
    let token = req.cookies["user_cookie"]
    return await verify(token, CLIENT_ID)
    
}

export {verify, checkAuthenticated}