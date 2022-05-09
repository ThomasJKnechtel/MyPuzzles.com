import { Router } from "express";
import {spawn} from 'node:child_process'
import {config} from 'dotenv'
import multer from 'multer'
config('.env')

const selectGamesRouter = Router()
const upload = multer()

selectGamesRouter.post('/generatePuzzles', upload.none(), async (req, res)=>{
    const formData =req.body
    const puzzleGenerator = spawn('python',[process.env.WEBSITE_PATH+'/Modules/PuzzleGenerator/PuzzleGenerator.py',JSON.stringify(formData)])
   
    puzzleGenerator.stdout.on('data', (data)=>{
        console.log(data.toString())
        res.json(JSON.parse(data.toString()))
    })
    puzzleGenerator.stderr.on('data', (data)=>{
        console.log(data.toString())
        res.sendStatus(500)
    })
    puzzleGenerator.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
   
    

    
   
})
export{ selectGamesRouter}