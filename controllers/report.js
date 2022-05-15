import { Router } from "express";
import { updateUserStats } from "../Modules/report.js";
const reportRouter = Router()
reportRouter.post('/updateUserStats', (req, res)=>{
    const userResults = req.body
    userResults['user_id'] = '111'
    updateUserStats(userResults, res)
})
export {reportRouter}