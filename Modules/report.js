import mssql from 'mssql'
import {config} from 'dotenv'
config('.env')

const sqlConfig = {
    user:'MyPuzzles',
    password: process.env.PASSWORD,
    server: 'localhost',
    database: 'MyPuzzles.com',
    options:{
        encrypt: true,
        trustServerCertificate: true
    }
}
/**
 * Updates user stats and puzzles
 * @param {Object} userStats must have a user_id element
 * @param {Response} res
 */
const updateUserStats = async function(userStats, res){
    if(typeof userStats === 'object'){
        const user_id = userStats.user_id
        const puzzlesStats = userStats.puzzles
        const sessionStats = userStats.session_stats
        try{
            let userStats = await getUserStats(user_id, Object.keys(puzzlesStats))
            let puzzles = userStats['puzzles']
            puzzles = puzzles.map(puzzle => {
                let puzzleStats = puzzlesStats[puzzle['puzzle_id']]
                let attempts = puzzle['attempts']
                let success_rate = puzzle['success_rate']
                if(puzzleStats['result']){
                   success_rate = Math.ceil((attempts*success_rate/100+1)/(attempts+1)*100)
                }else{
                    success_rate = Math.ceil((attempts*success_rate/100)/(attempts+1)*100)
                }
                puzzle['success_rate'] = success_rate
                puzzle['attempts'] = attempts+1
                return puzzle
            })
            userStats['puzzles']=puzzles
            let success_rate = userStats['userStats']['success_rate']
            let attempts = userStats['userStats']['attempts']
            success_rate = Math.ceil((sessionStats['successRate']*puzzles.length+success_rate*attempts)/(attempts+puzzles.length))
            attempts += puzzles.length
            userStats['userStats']= {'success_rate':success_rate, 'attempts':attempts,'time_spent':userStats['userStats']['time_spent']+parseInt(sessionStats['timeSpent'])}
            await setUserStats(user_id, userStats['userStats'])
            await setUserPuzzles(user_id, userStats['puzzles'])
            res.sendStatus(204)
        }catch(err){
            if (err instanceof mssql.ConnectionError){
                console.log(err)
                res.sendStatus(503)
            }else{
                console.log(err)
                res.sendStatus(300)
            }
        }
    }else{
        res.sendStatus(300)
    }
    
}
 
/**
 * Returns a users stats and the puzzles with specified ids
 * @param {Number} user_id 
 * @param {Array<Number>} puzzle_ids
 * @returns the users stats and stats of puzzles
 */
const getUserStats = async function(user_id, puzzle_ids){
    let puzzleIdPart = ' AND puzzle_id = '+puzzle_ids[0]
    if(puzzle_ids.length>1){
        for(let i = 0; i<puzzle_ids.length; i++){
            puzzleIdPart += ' OR puzzle_id ='+puzzle_ids[i]
        }
    }
    const queryPuzzles = "SELECT success_rate, attempts, puzzle_id FROM puzzles WHERE user_id = "+user_id+puzzleIdPart
    const queryUserStats = "SELECT success_rate, attempts, time_spent FROM users WHERE user_id = "+user_id
    await mssql.connect(sqlConfig)
    let result = await mssql.query(queryPuzzles)
    let puzzles  = Array.from(result.recordset.values())
    let userResults = await mssql.query(queryUserStats)
    let userStats = Array.from(userResults.recordset.values())[0]

    return {puzzles: puzzles, userStats: userStats}
}
/**
 * Updates the user's stats
 * @param {Number} user_id 
 * @param {Object} data 
 */
const setUserStats = async function(user_id, data){
    const queryUserStats = "UPDATE users SET success_rate = "+data['success_rate']+", attempts = "+data['attempts']+", time_spent="+data['time_spent']+" WHERE user_id = "+user_id
    await mssql.connect(sqlConfig)
    await mssql.query(queryUserStats)
}
/**
 * Updates a user's puzzle stats
 * @param {Number} user_id 
 * @param {Array<Object>} puzzles 
 */
const setUserPuzzles = async function(user_id, puzzles){
    await mssql.connect(sqlConfig)
    puzzles.map(async puzzle=>{
        const query = "UPDATE puzzles SET success_rate = "+puzzle['success_rate']+", attempts = "+puzzle['attempts']+" WHERE user_id = "+user_id+" AND puzzle_id = "+puzzle['puzzle_id']
        await mssql.query(query)
    })
}
export {updateUserStats}