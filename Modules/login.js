import { OAuth2Client } from "google-auth-library";
import mssql from 'mssql'
import { config } from "dotenv";
config('./env')
const CLIENT_ID = '363664896936-hnbv6e362m5rs4lvdeb8236go8g0agpk.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
/**
 * verify with google that token is valid
 * @param {Token} token the ID token to verify
 * @param {Response} res 
 * @returns the google user_id of user
 */
const verify = async function(token) {
   
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
const checkAuthenticated = async function(req){
    let token = req.cookies["user_cookie"]
    return await verify(token)
    
}
const addNewUser = async function(user_id){
    const config = {
        user:'MyPuzzles',
        password: process.env.PASSWORD,
        server: 'localhost',
        database: 'MyPuzzles.com',
        options:{
            encrypt: true,
            trustServerCertificate: true
        }
    }
    const query = `INSERT INTO users VALUES (${user_id}, 0, 0, 0)`
    try{
        await mssql.connect(config)
        await mssql.query(query)
    }catch(err){
        if(!err instanceof mssql.RequestError)
            console.log(err)
    }
    
}

export {verify, checkAuthenticated, addNewUser}