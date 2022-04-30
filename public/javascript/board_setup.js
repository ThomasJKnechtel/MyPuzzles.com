
/**
 * sets up board to only allow legal moves.
 * Taken from: https://www.chessboardjs.com/examples/5000 
 * @param {ChessBoard} board the board that displays the game
 * @param {Chess} game the Chess object representing the state of the board
 */
function boardSetUp(board, game, continuation, boardState){
    
    let $status = $('#status')
    let $fen = $('#fen')
    let $pgn = $('#pgn')

    function onDragStart (source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // only pick up pieces for the side to move
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }
    }

    function onDrop (source, target) {
        // see if the move is legal
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback'
       
        updateStatus()     
        updateProgress(boardState,continuation,move)
        updateScoreSheet(boardState, move, game)
        console.log(boardState.progress)
    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    function onSnapEnd () {
        board.position(game.fen())
    }

    function updateStatus () {
        let status = ''

        let moveColor = 'White'
        if (game.turn() === 'b') {
            moveColor = 'Black'
        }

        // checkmate?
        if (game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.'
        }

        // draw?
        else if (game.in_draw()) {
            status = 'Game over, drawn position'
        }

        // game still on
        else {
            status = moveColor + ' to move'

            // check?
            if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
            }
        }

        $status.html(status)
        $fen.html(game.fen())
        $pgn.html(game.pgn())
    }

    let config = {
        draggable: true,
        position: game.fen(),
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    }
    board = Chessboard('myBoard', config)

    updateStatus()


}
/**
 * On move click update board to the position requested
 * @param {HTMLElement} elem the element that was clicked
 */
function moveClicked(elem){
    let varNumber=parseInt(elem.outerHTML.split("varnumber=")[1].split(" ")[0].replace("\"",""))
    let ply=parseInt(elem.outerHTML.split("ply=")[1].split(">")[0].replace("\"",""))
    let move = elem.innerText.split(" ")[1]
    boardState.currentPly=ply
    boardState.variations.map((variation)=>{
        if(variation.variationNumber==varNumber){
            boardState.currentVariation=variation
        }
    })
    game=new Chess( boardState.currentVariation.fens[ply-boardState.currentVariation.startingPly])
    boardSetUp(board, game, gameData.continuation,boardState)

}

function updateScoreSheet(boardState, move, game){
    let currentVariation = boardState.currentVariation
    boardState.currentPly++
    if(boardState.currentPly<currentVariation.size+currentVariation.startingPly){  //if not at end of variation
            
        if(currentVariation.variations.length>0&&currentVariation.variations.map((subVariation)=>{    //if subvariation has move
                if(subVariation.hasMove(move.san, boardState.currentPly)){
                    currentVariation=subVariation
                    return true
                }
        })){
            return true
        }
        else if(!currentVariation.hasMove(move.san, boardState.currentPly)){    //if current variation doesnt have move
            boardState.currentVariation=currentVariation.addSubVariation(boardState.currentPly, game.fen())
            boardState.variations.push(boardState.currentVariation)
            boardState.currentVariation.addMove(move.san, game.fen())
            document.getElementById("pgnContainer").innerHTML=boardState.mainVariation.getPGNHTML()
        }
        
    }
    else{   //at end of variation
        currentVariation.addMove(move.san, game.fen())
        document.getElementById("pgnContainer").innerHTML=boardState.mainVariation.getPGNHTML()
    }
}
function updateProgress(boardState, continuation, move){
    if(boardState.progress == "Solving"){
        if(boardState.currentVariation!=boardState.mainVariation){
            boardState.progress = "Failed"
        }else if(move.san!=continuation[boardState.currentPly]){
            boardState.progress="Failed"
        }else if(boardState.currentPly==continuation.length-1){
            boardState.progress="Passed"
        }
    }
}