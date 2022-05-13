
/**
 * sends game data response
 * @param {Request} req 
 * @param {Response} res 
 */
const getGameData = function getGameData(req, res){
    const testData = {
        fen: "rn1qkbnr/pP1b1ppp/4p3/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 1 5",
        continuation: 'bxa8=Q'
    }
    res.status(200)
    res.json(testData)
}

export {getGameData}