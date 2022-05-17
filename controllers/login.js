import { Router } from "express";
import {verify, addNewUser} from '../Modules/login.js'


const loginRouter = Router()

loginRouter.post('/login', (req, res)=>{
    const token = req.cookies['g_csrf_token']
    const token_body = req.body['g_csrf_token']

    if(token === token_body && token !== undefined){    //preventative measure against csrf attacks
        verify(req.body.credential).catch(console.error).then((data)=>{
            const user_id = data['user_id']
            addNewUser(user_id)
            res.cookie('user_cookie',req.body.credential,{expires:new Date(Date.now()+1200000), httpOnly: true})
            res.cookie('logged_in',true,{expires:new Date(Date.now()+1200000)})
            res.redirect('http://localhost:7500/select_games.html')
        });
    }else{
        res.sendStatus(400).send('Failed to verify double submit cookie')
    }
    
})

export {loginRouter}