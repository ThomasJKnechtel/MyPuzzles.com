import { Router } from "express"
import {getUserPuzzles} from "../Modules/search_puzzles.js"
let router = Router()

router.get('/search', async (req,res)=>{
    const formData = req.query
    const puzzles = await getUserPuzzles(111, formData.playerName,formData.opponentName, formData.event,
         formData.startDate, formData.endDate, formData.notAttempted, formData.numGames, 
         formData.primarySort, formData.secondarySort, formData.tertiararrySort)
    if(puzzles=='No Connection') res.sendStatus(503)
    else if(puzzles==='Bad Request') res.sendStatus(400)
    else {
        res.json(puzzles)
    }
})

export {router}