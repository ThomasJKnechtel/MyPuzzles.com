
import mssql from 'mssql'
import {config} from 'dotenv'
config('.env')
/**
 * Gets a list of puzzles for user that matches the specified criteria
 * @param {Number} userid 
 * @param {String} player 
 * @param {String} opponent 
 * @param {String} event 
 * @param {Date} startDate inclusive
 * @param {Date} endDate inclusive
 * @param {Boolean} notAttempted return only puzzles not attempted
 * @param {Number} numGames upper limit inclusive
 * @param {String} primaryCriteria Order all elements by this criteria
 * @param {String} secondaryCriteria Order all sub-sets by this criteria
 * @param {String} tertiararyCriteria Order all sub-sets of sub-sets by this criteria
 * @returns {list} a list of puzzles
 */
const getUserPuzzles =async function getUserPuzzles(userid,player, opponent, event, startDate, endDate, notAttempted=false, numGames, primaryCriteria, secondaryCriteria, tertiararyCriteria){
   
    let query = (numGames!=='')? 'SELECT TOP '+numGames+' puzzle_id, white, black, date, fen, continuation, event, success_rate, attempts FROM puzzles WHERE user_id='+userid:  'SELECT puzzle_id white, black, date, fen, continuation, event, success_rate, attempts FROM puzzles WHERE user_id='+userid
    let part1 = (player!=='')? ' AND (white=\''+player+'\' OR black=\''+player+'\')':''
    let part2 = (event!=='')?' AND event=\''+event+'\'':'' 
    let part3 = (startDate!=='')?' AND date>=\''+startDate+'\'':''
    let part4 = (endDate!=='')?' AND date<=\''+endDate+'\'':''
    let part5 = (notAttempted===false)?'':' AND attempts=0'
    let part6 = (opponent!=='')?' AND (white=\''+opponent+'\' OR black=\''+opponent+'\')':''
    const getSortCriteria = function getSortCriteria(criteria){
        if(criteria==='lowSuccessRate')return 'success_rate ASC'
        else if(criteria==='highSuccessRate')return 'success_rate DESC'
        else if(criteria==='leastAttempts')return 'attempts ASC'
        else if(criteria==='mostAttempts')return 'attempts DESC'
        else if(criteria==='leastRecent')return 'date ASC'
        else return 'date DESC'
    }
    
    const getPuzzles = async function getPuzzles(query){
        const config = {
            user:'MyPuzzles',
            password: process.env.PASSWORD,
            server: 'localhost',
            database: 'MyPuzzles.com',
            options:{
                encrypt: true,
                trustServerCertificate: true
            }
        }
        let result=null
        try{
            await mssql.connect(config)
        }catch(err){
            console.error(err)
            return "No Connection"
        }
        try{
            result = await mssql.query(query)
        }catch(err){
            console.error(err)
            return "Bad Request"
        }
        return result.recordset
    }
    let sortPart =''
    if(primaryCriteria!=undefined){
        sortPart=' Order by '+getSortCriteria(primaryCriteria)
        if(secondaryCriteria!=undefined&&secondaryCriteria!==primaryCriteria){
            sortPart+=', '+getSortCriteria(secondaryCriteria)
            if(tertiararyCriteria!=undefined&&tertiararyCriteria!=secondaryCriteria&&tertiararyCriteria!=primaryCriteria){
                sortPart+=', '+getSortCriteria(tertiararyCriteria)
            }
        }
    }
    
    
    query+=part1+part2+part3+part4+part5+part6+sortPart
    const puzzles = await getPuzzles(query)
    console.log(query)
    return puzzles
}

export {getUserPuzzles}