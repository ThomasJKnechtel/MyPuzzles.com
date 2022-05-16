import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import { getGameData } from './controllers/play.js'
import {searchPuzzlesRouter} from './controllers/search_puzzles.js'
import {selectGamesRouter} from './controllers/select_games.js'
import { reportRouter } from './controllers/report.js'
import { loginRouter } from './controllers/login.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let server = express();
server.use(bodyParser.urlencoded({'extended':'true'}))
server.use(bodyParser.json())
server.use(express.static(__dirname+'/public'))
server.use(cookieParser())

server.use('/login.html', loginRouter)
server.use('/search_puzzles.html',searchPuzzlesRouter)
server.use('/select_games.html', selectGamesRouter)
server.use('/report.html', reportRouter)

const PORT = process.env.PORT ||7500;
server.listen(PORT, console.log(`Server started  on port ${PORT}`))