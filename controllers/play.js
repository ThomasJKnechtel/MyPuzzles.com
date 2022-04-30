
/**
 * sends game data response
 * @param {Request} req 
 * @param {Response} res 
 */
const getGameData = function getGameData(req, res){
    const testData = {
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        continuation: "Nf6 Nf3 Nxe4 d4 Ne6 Bxc6 dxc6 dxe5 Nf5 Qxd8"
    }
    res.status(200)
    res.json(testData)
}

export {getGameData}