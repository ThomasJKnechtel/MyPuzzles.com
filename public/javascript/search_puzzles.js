const submitForm = async function submitForm(){
    const formData = new FormData(document.getElementById("puzzleSearchForm"))
    formData.append('user_id','111')
    fetch('search_puzzles.html/search', {method:'POST', body:formData}).then(res => res.json()).then(puzzles =>{
        const handleDate = date => {return new Date(date).toDateString()}
        updateTable('tbody',puzzles, {'ignore':{'continuation':true,'puzzle_id':true}, 'handle':{'date':handleDate}})
        let fens = Array.from(document.getElementsByClassName('fen'))
        let count = 0
        fens.map(element => {
            element.onmouseover=hover
            element.onmouseleave=leave
            element.id = puzzles[count]['puzzle_id']
            element.continuation = puzzles[count]['continuation']
            count++
        });
    })
}

/**
 * Update style of clicked row
 * @param {HTMLElement} elem 
 */
const rowClicked = function rowClicked(elem){
    if(elem.classList.contains('clicked')) elem.classList.remove('clicked')
    else{
        elem.classList.add('clicked')
    }
}
/**
 * displays fen on board
 * @param {HTMLElement} elem 
 */
const hover = function hover(elem){
    const fen = this.innerHTML
    const boardDiv = document.createElement('div')
    boardDiv.id='myBoard'
    boardDiv.classList.add('board')
    boardDiv.style.position='absolute'
    boardDiv.style.right=0
    boardDiv.style.top=-200+"px"
    boardDiv.style.width='200px'
    
    boardDiv.style.zIndex='1'
    this.innerHTML+=boardDiv.outerHTML
   
    const config = {
        orientation: (fen.includes('w'))?"white":"black",
        position: fen
    }
    new ChessBoard('myBoard', config)
}
/**
 * On mouse leaving event remove board
 */
const leave = function leave(){
    document.getElementById('myBoard').outerHTML=''
}
/**
     * Creates a puzzle object from table row
     * @param {HTMLElement} element 
     */
 const createPuzzle= function(element){
    const white = element.getElementsByClassName('white')[0].innerHTML
    const black = element.getElementsByClassName('black')[0].innerHTML
    const date = element.getElementsByClassName('date')[0].innerHTML
    const fen = element.getElementsByClassName('fen')[0].innerHTML
    const puzzle_id = element.getElementsByClassName('fen')[0].id
    const event = element.getElementsByClassName('event')[0].innerHTML
    const success_rate = element.getElementsByClassName('success_rate')[0].innerHTML
    const attempts = element.getElementsByClassName('attempts')[0].innerHTML
    const continuation = element.getElementsByClassName('fen')[0].continuation
    return puzzle = { 'white': white, 'black':black,'date':date,'fen':fen, 'puzzle_id': parseInt(puzzle_id), 'event':event, 'continuation':continuation, 'success_rate':parseFloat(success_rate), 'attempts':parseInt(attempts)}
}
/**
 * If puzzles clicked returns list of them, otherwise return all puzzles.
 * @returns A list of puzzles to play
 */
const getPuzzles = function(){
    const clickedElements =Array.from(document.getElementsByClassName('clicked'))
    let puzzles = [] 
    
    if(clickedElements.length>0){
        clickedElements.map(element =>{
            puzzles.push(createPuzzle(element))
         })
    }else{
        const rows = Array.from(document.getElementsByClassName('row'))
        rows.map(row => {
            puzzles.push(createPuzzle(row))
        })
    }
    return puzzles
}
/**
 * Handles request to play casual
 */
const playCasual = function playCasual(){
    const puzzles = getPuzzles()
    sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
    sessionStorage.setItem('mode','casual')
    sessionStorage.setItem('count',0)
    sessionStorage.setItem('puzzle_results',JSON.stringify({}))
    window.location.href="http://localhost:7500/play.html"
}
/**
 * handles request to play 3 minute mode
 */
const play3Minute=function(){
    const puzzles = getPuzzles()
    sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
    sessionStorage.setItem('mode','3Minute')
    sessionStorage.setItem('count',0)
    sessionStorage.setItem('puzzle_results',JSON.stringify({}))
}
/**
 * handles request to play 5 minute
 */
const play5Minute=function(){
    const puzzles = getPuzzles()
    sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
    sessionStorage.setItem('mode','5Minute')
    sessionStorage.setItem('count',0)
    sessionStorage.setItem('puzzle_results',JSON.stringify({}))
}