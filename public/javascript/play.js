let boardState = null
let board = null
let game = null
let puzzle = null
let timer = null
let size = 0
let startTime = 0
let endTime = 0
/**
 * Gets Puzzle and updates puzzles started count
 * @returns Puzzle to play
 */
const getPuzzle = function(){
    let count = parseInt(sessionStorage.getItem('count'))
    const puzzles =  JSON.parse(sessionStorage.getItem('puzzles'))
    const puzzle = puzzles[count]
    size=puzzles.length
    count++
    sessionStorage.setItem('count',count)
    return puzzle
}
const startGame = async function startGame(){
    puzzle = getPuzzle()
    const continuation = puzzle.continuation.trim().split(' ')
    const mode = sessionStorage.getItem('mode')
    board = Chessboard('myBoard');
    game = new Chess(puzzle.fen);
    
    let variation = new Variation(0, game.fen())
    boardState={
        currentVariation:variation,
        mainVariation:variation,
        currentPly:0,
        variations:[variation],
        progress:"Solving",
        promotionInProgress:false,
        promotionMove: null,
        orientation:(game.turn()==='w')?"white":"black",
        mode: mode
    }
    const promote = function(elem){
        const type =  this.getAttribute('type')
        let div = document.getElementById('promotionPopup')
        div.innerHTML = ""
        div.style = "display: none;"
        let move = boardState.promotionMove
        move.promotion = type
        move = addMove(move,game, boardState)
        updateScoreSheet(boardState,move, game)
        updateProgress(boardState, continuation,move)
        boardSetUp(board, game, continuation, boardState, displayPromotionPopup, boardState.orientation)
    }
    const displayPromotionPopup = function(white, fileNumber){
        const peiceImageNames = ['wQ.png','wN.png','wR.png','wB.png', 'bQ.png', 'bN.png','bR.png','bB.png']
        const pieceTypes = ['q','n','r','b']
        for(let i=0; i<4; i++){
            let peiceButton = document.createElement('button')
            peiceButton.onclick = promote
            peiceButton.setAttribute('type',pieceTypes[i])
            peiceButton.style="width: fit-content; height: fit-content;"
            let image = document.createElement('img')
            let index=i
            if(!white)index+=4
            image.setAttribute('src',"img/chesspieces/wikipedia/"+peiceImageNames[index])
            image.style="width: 100%;"
            peiceButton.appendChild(image)
            
            let div = document.getElementById('promotionPopup')
            div.appendChild(peiceButton)
            div.style="width: 12.5%; height:200px;position: absolute; z-index: 1; top:0; left:"+fileNumber*50
        }
        
    }
    
    boardSetUp(board, game, continuation, boardState, displayPromotionPopup, boardState.orientation);
    timer = countdown(10000, 10)
}
const giveUp = function(){
    window.loction.href='http://localhost:7500/search_puzzles.html'
}
const nextPuzzle = function() { 
    let puzzleResult = {
        "timeSpent":endTime-startTime,
        "result":(boardState["progress"]==="Passed")?true:false
    }
    let puzzleResults = JSON.parse(sessionStorage.getItem('puzzle_results'))
    puzzleResults[puzzle['puzzle_id']]=puzzleResult
    sessionStorage.setItem('puzzle_results', JSON.stringify(puzzleResults))
    if(parseInt(sessionStorage.getItem('count')) === size){
        window.location.href='http://localhost:7500/search_puzzles.html'
    }else{
        window.location.reload()
    }
}

startGame()
startTime = Date.now()
