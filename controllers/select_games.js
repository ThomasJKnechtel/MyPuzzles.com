import { Router } from "express";
import {spawn} from 'node:child_process'
import {config} from 'dotenv'
config('.env')

const selectGamesRouter = Router()

selectGamesRouter.post('/getGames', async (req, res)=>{
    const formData =req.body
    const puzzleGenerator = spawn('python',[process.env.WEBSITE_PATH+'/Modules/PuzzleGenerator/PuzzleGenerator.py',JSON.stringify(formData)])
   
    puzzleGenerator.stdout.on('data', (data)=>{
        console.log(data.toString())
    })
    puzzleGenerator.stderr.on('data', (data)=>{
        console.log(data.toString())
    })
    puzzleGenerator.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
    res.sendStatus(200)
    

    
   
})
export{ selectGamesRouter}