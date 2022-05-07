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
    return puzzleSuccess/total
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
    document.getElementById("successRate").innerText = calculateSuccessRate(puzzles)
    document.getElementById("longestStreak").innerText = calculateLongestStreak(puzzles)
}
/**
 * creates a puzzle HTMLElement
 * @param {Object} puzzleStats object containing the puzzle stats
 * @param {Object} puzzle the corresponding puzzle
 * @returns {HTMLElement} puzzleElement
 */
const createPuzzleElement = function(puzzleStats, puzzle, count){
    let puzzleElement = document.createElement('div')
    const date = new Date(puzzleStats['timeSpent'])
    const timeSpent = new Date(puzzleStats['timeSpent']).toUTCString().split(" ")[4]
    if(puzzleStats['result'])puzzleElement.classList.add('passed')
    else puzzleElement.classList.add('failed')
    let innerHTML = `<label>Puzzle ${count}</label><div id="board${count}"></div><label>Time Spent: ${timeSpent}</label><label>Continuation:</label><label class="continuation">${puzzle.continuation}</label>`
    puzzleElement.innerHTML = innerHTML
    return puzzleElement
}
/**
 * Updates puzzle stats 
 * @param {Object} puzzlesStats 
 * @param {Object} puzzles 
 */
const updatePuzzleStats = function(puzzlesStats, puzzles){
    let count = 0
    puzzlesStats.map(puzzleStats => {
        const elem = createPuzzleElement(puzzleStats, puzzles[count], count)
        count++
        document.getElementById("puzzleContainer").innerHTML+=elem.outerHTML
    })
}
updateSessionStats(Object.values(results))
updatePuzzleStats(Object.values(results), puzzles)