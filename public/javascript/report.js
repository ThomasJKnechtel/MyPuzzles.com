const results = JSON.parse(sessionStorage.getItem('puzzle_results'))
const puzzles = JSON.parse(sessionStorage.getItem('puzzles'))
/**
 * Calculates the success rate for a list of puzzles
 * @param {Array<Object>} puzzles 
 * @returns {number} the success rate
 */
const calculateSuccessRate = function(puzzles){
    let puzzleSuccess = 0
    let total = 0 
    puzzles.map(puzzle => {
        if(puzzle['result']===true) puzzleSuccess++
        total++
    })
    return Math.round(puzzleSuccess/total*100)
}
/**
 * Calculates the longest streak for a list of puzzles
 * @param {Array<Object>} puzzles 
 * @returns {Number} the longest streak
 */
const calculateLongestStreak = function(puzzles){
    let longestStreak = 0
    let streakSize = 0
    puzzles.map(puzzle => {
        if(puzzle['result']===true){
            streakSize++
        }else{
            if(longestStreak<streakSize) longestStreak=streakSize
            streakSize=0
        }
    })
    if(streakSize>longestStreak)longestStreak=streakSize
    return longestStreak
}
/**
 * Updates the session stats elements
 * @param {Array<Object>} puzzles 
 */
const updateSessionStats = function(puzzles){
    document.getElementById("puzzlesAttempted").innerText = puzzles.length
    document.getElementById("successRate").innerText = calculateSuccessRate(puzzles)+'%'
    document.getElementById("longestStreak").innerText = calculateLongestStreak(puzzles)
}
/**
 * creates a puzzle HTMLElement
 * @param {Object} puzzleStats object containing the puzzle stats
 * @param {Object} puzzle the corresponding puzzle
 * @returns {HTMLElement} puzzleElement
 */
const createPuzzleElement = function(puzzleStats, puzzle, count){
    if(puzzleStats!==undefined){
        let puzzleElement = document.createElement('div')
        const date = new Date(puzzleStats['timeSpent'])
        const timeSpent = new Date(puzzleStats['timeSpent']).toUTCString().split(" ")[4]
        puzzleElement.classList.add('puzzleContainer')
        let classType = (puzzleStats['result'])?"passed":"failed"
        let innerHTML = `<label class=${classType}>Puzzle ${count}</label><div id="board${count}" class="boardContainer"></div><label>Time Spent: ${timeSpent}</label><label>Continuation:</label><label class="continuation">${puzzle.continuation}</label>`
        puzzleElement.innerHTML = innerHTML
        return puzzleElement
    }
    
}
/**
 * Updates puzzle stats 
 * @param {Object} puzzlesStats 
 * @param {Object} puzzles 
 */
const updatePuzzleStats = function(puzzlesStats, puzzles){
    let count = 0
    let container = document.getElementById("puzzlesContainer")
    container.innerHTML=''
    puzzles.map(puzzle => {
        const puzzleStats = puzzlesStats[puzzle['puzzle_id']]
        const elem = createPuzzleElement(puzzleStats, puzzles[count], count+1)
        const fen = puzzle['fen']
        
        container.innerHTML+=elem.outerHTML
        
        const config = {
            orientation: (fen.includes('w'))?'white':'black',
            position: fen,
            showNotation: false
        }
        const board = new ChessBoard('board'+(count+1), config)
        count++
    })
}
/**
 * sends all user stats to server to update
 * @param {Object} results the results of each puzzle
 * @param  {Array<Object>} puzzles an array of puzzle objects
 * @param {Number} timeSpent the total time spent
 */
const updateUserStats = function(results, puzzles, timeSpent){
    let userStats = {'session_stats':{}, 'puzzles':{}}
    puzzles.map(puzzle =>{
        const id = puzzle['puzzle_id']
        const puzzleStats = results[id]
        userStats['puzzles'][id]=puzzleStats
    })
    userStats['session_stats']= {'successRate':calculateSuccessRate(Object.values(results)), 'longestStreak':calculateLongestStreak(Object.values(results)), 'timeSpent': timeSpent}
    fetch('report.html/updateUserStats', {method:'Post', headers:{'Content-Type':'application/json'}, body:JSON.stringify(userStats)}).then(res => {
        if(res.status==302){
            window.location.href='http://localhost:7500/login.html'
        }else if(res.status != 204){
            console.log(res.statusText)
        }
    })
}
updateSessionStats(Object.values(results))
updatePuzzleStats(results, puzzles)
updateUserStats(results, puzzles, sessionStorage.getItem('timeSpent'))