import { Router } from "express";
import {verify} from '../Modules/login.js'
const CLIENT_ID = '363664896936-hnbv6e362m5rs4lvdeb8236go8g0agpk.apps.googleusercontent.com'

const loginRouter = Router()

loginRouter.post('/login', (req, res)=>{
    const token = req.cookies['g_csrf_token']
    const token_body = req.body['g_csrf_token']

    if(token === token_body && token !== undefined){    //preventative measure against csrf attacks
        verify(req.body.credential, CLIENT_ID).catch(console.error).then(()=>{
            res.cookie('user_cookie',req.body.token,{expires:new Date(Date.now()+1200000), httpOnly: true})
            res.redirect('http://localhost:7500/select_games.html')
        });
    }else{
        res.sendStatus(400).send('Failed to verify double submit cookie')
    }
    
})

export {loginRouter}