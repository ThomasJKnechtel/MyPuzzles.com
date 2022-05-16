import { Router } from "express"
import {getUserPuzzles, deletePuzzles} from "../Modules/search_puzzles.js"
import {checkAuthenticated} from "../Modules/login.js"
import multer from 'multer'
const searchPuzzlesRouter = Router()
const upload = multer()
searchPuzzlesRouter.post('/search',upload.none() ,async (req,res)=>{
    try{
        const user_id = await checkAuthenticated(req)
        const formData = req.body
        const puzzles = await getUserPuzzles(user_id, formData.playerName,formData.opponentName, formData.event,
             formData.startDate, formData.endDate, formData.notAttempted, formData.numGames, 
             formData.primarySort, formData.secondarySort, formData.tertiararrySort)
        if(puzzles==='No Connection') res.sendStatus(503)
        else if(puzzles==='Bad Request') res.sendStatus(400)
        else {
            res.json(puzzles)
        }
    }catch{
        res.sendStatus(302)
    }
   
})

searchPuzzlesRouter.delete('/delete_puzzles',async (req, res)=>{
    const user_id = await checkAuthenticated(req).catch(res.redirect('http://localhost:7500/login.html'))
    const puzzles = req.body
    deletePuzzles(user_id, puzzles, res)
})

export {searchPuzzlesRouter}