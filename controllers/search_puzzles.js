import { Router } from "express"
import {getUserPuzzles} from "../Modules/search_puzzles.js"
import multer from 'multer'
const router = Router()
const upload = multer()
router.post('/search',upload.none() ,async (req,res)=>{
    const formData = req.body
    const puzzles = await getUserPuzzles(formData.user_id, formData.playerName,formData.opponentName, formData.event,
         formData.startDate, formData.endDate, formData.notAttempted, formData.numGames, 
         formData.primarySort, formData.secondarySort, formData.tertiararrySort)
    if(puzzles=='No Connection') res.sendStatus(503)
    else if(puzzles==='Bad Request') res.sendStatus(400)
    else {
        res.json(puzzles)
    }
})

export {router}