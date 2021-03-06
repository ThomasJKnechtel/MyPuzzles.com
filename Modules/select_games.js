import mssql from 'mssql'
import {config} from 'dotenv'
config('./env')
/**
 * saves puzzle to database
 * @param {Array<Object>} puzzles list of puzzles
 */
const save = async function(puzzles, res){
   
    let query = "INSERT INTO Puzzles VALUES "
    for(let i=0; i<puzzles.length; i++){
        let puzzle = puzzles[i]
        if(typeof puzzle !== 'object')  throw TypeError
        query+="('"+puzzle['white']+"','"+puzzle['black']+"','"+puzzle['date']+"','"+puzzle['fen']+"','"+puzzle['continuation']+"','"+puzzle['event']+"', 0, 0, 111)"
        if(i==puzzles.length-1){
            query+=';'
        }else{
            query+=','
        }
    }
    console.log(query)
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
    try{
        await mssql.connect(config)
    }catch(err){
        console.error(err)
        res.sendStatus(503)
    }try{
        await mssql.query(query)
        res.sendStatus(204)
    }catch(err){
        console.log(err)
        res.sendStatus(400)
    }
    
}
export{save}