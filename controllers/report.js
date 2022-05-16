import { Router } from "express";
import { checkAuthenticated } from "../Modules/login.js";
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
export {reportRouter}