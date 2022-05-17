import { Router } from "express";
import { checkAuthenticated, verify } from "../Modules/login.js";
import { updateUserStats } from "../Modules/report.js";
const reportRouter = Router()
reportRouter.post('/updateUserStats', async (req, res)=>{
    const userResults = req.body
    try{
        const user_id = await checkAuthenticated(req)
        userResults['user_id'] = user_id
        updateUserStats(userResults, res)
    }catch{
        res.sendStatus(302)
    }
    
})
reportRouter.post('/authenticate', async(req, res)=>{
    let token = req.cookies["user_cookie"]
    try{
        const {picture} = await verify(token)
        res.send(picture)
    }catch{
        res.sendStatus(302)
    }
})
export {reportRouter}