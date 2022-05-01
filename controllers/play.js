
/**
 * sends game data response
 * @param {Request} req 
 * @param {Response} res 
 */
const getGameData = function getGameData(req, res){
    const testData = {
        fen: "rn1qkbnr/pP1b1ppp/4p3/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 1 5",
        continuation: "O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+"
    }
    res.status(200)
    res.json(testData)
}

export {getGameData}