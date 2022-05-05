import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import { getGameData } from './controllers/play.js'
import {router} from './controllers/search_puzzles.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let server = express();
server.use(bodyParser.urlencoded({'extended':'true'}))
server.use(bodyParser.json())
server.use(express.static(__dirname+'/public'))
server.use(cookieParser())

server.get("/play/game_data", getGameData)


server.use('/search_puzzles.html',router)



const PORT = process.env.PORT ||7500;
server.listen(PORT, console.log(`Server started  on port ${PORT}`))