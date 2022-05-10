let puzzles = []
const generatePuzzles = function(){
    const formData = new FormData(document.getElementById('gamePerameters'))
    fetch('select_games.html/generatePuzzles', {method:'Post', body: formData}).then(response => {
        if(response.status==200) response.json().then(json =>{
            updateTable(json, document.getElementById('puzzleTableBody'))
            puzzles=json
        })
        else if(response.status==503){
            alert('Service is temporarily unavailable')
            return null
        } 
        else if(response.status==500){
            alert('Error occured processing games')
            return null
        } 
    })
    

}
/**
 * adds a puzzle to the table
 * @param {Object} puzzle
 * @param {HTMLElement} tableBody the tablebody element of table to add to
 */
const addPuzzleToTable = function(puzzle, tableBody){
    if(puzzle!==undefined){
        const innerHTML = '<tr class="row" class="row" onclick="clicked(this)"><td>'+puzzle['white']+'</td><td>'+puzzle['black']+'</td><td>'+puzzle['date']+'</td><td>'+puzzle['event']+'</td><td onmouseover="hover(this)" onmouseleave="leave(this)">'+puzzle['fen']+'</td><td><label class="continuation">'+puzzle['continuation']+'</label></td></tr>'
        tableBody.innerHTML+=innerHTML
    }
}
/**
 * updates table with list of puzzles
 * @param {Array<Object>} puzzles 
 * @param {HTMLElement} tableBody 
 */
const updateTable = function(puzzles, tableBody){
    if(puzzles!==undefined){
        puzzles.map(puzzle => {
            addPuzzleToTable(puzzle, tableBody)
        })
    }
}
/**
 * updates classlist if row is clicked
 */
const clicked = function(elem){
    if(elem.classList.contains('clicked')){
        elem.classList.remove('clicked')
    }else{
        elem.classList.add('clicked')
    }
}
/**
 * displays fen position on board
 */
const hover = function(elem){
    const fen = elem.innerText
    const boardDiv = document.createElement('div')
    boardDiv.id='myBoard'
    boardDiv.classList.add('board')
    boardDiv.style.position='absolute'
    boardDiv.style.right=0
    boardDiv.style.top=-200+"px"
    boardDiv.style.width='200px'
    
    boardDiv.style.zIndex='1'
    elem.innerHTML+=boardDiv.outerHTML
   
    const config = {
        orientation: (fen.includes('w'))?"white":"black",
        position: fen
    }
    new ChessBoard('myBoard', config)
}
/**
 * On mouse leaving event remove board
 */
 const leave = function(){
    document.getElementById('myBoard').outerHTML=''
}
/**
 * Save puzzles
 */
const save = function(){
    
        let puzzlesToSend = []
        const clicked = Array.from(document.getElementsByClassName('clicked'))
        if(clicked.length>0){
            clicked.map(puzzleElem => {
                 const children =puzzleElem.children
                 puzzle = {'white':children[0].innerText,'black':children[1].innerText, 'date':children[2].innerText, 'event':children[3].innerText, 'fen':children[4].innerText, 'continuation':children[5].getElementsByClassName('continuation')[0].innerText, 'success_rate':0, 'attempts':0}
                 puzzlesToSend.push(puzzle)
                 puzzleElem.outerHTML=''
            })
        }else{
            const rows = Array.from(document.getElementsByClassName('row'))
            rows.map(puzzleElem => {
                const children =puzzleElem.children
                puzzle = {'white':children[0].innerText,'black':children[1].innerText, 'date':children[2].innerText, 'event':children[3].innerText, 'fen':children[4].innerText, 'continuation':children[5].getElementsByClassName('continuation')[0].innerText, 'success_rate':0, 'attempts':0}
                puzzlesToSend.push(puzzle)
                puzzleElem.outerHTML=''
           })
        }
        fetch('select_games.html/save',{method:'Post', body: JSON.stringify(puzzlesToSend), headers:{'Content-Type':'application/json'}}).then(response => {alert(response.statusText)})
    
    
}
const deletePuzzles = function(){
    if(puzzles.length>0){
        const clicked = Arrays.from(document.getElementsByClassName('clicked'))
        if(clicked.length>0){
            clicked.map(puzzleElem => {
                puzzleElem.outerHTML=''
            })
        }else{
            document.getElementById('puzzleTableBody').innerHTML="<tr><th>White</th><th>Black</th><th>Date</th><th>Event</th><th>FEN</th><th>Continuation</th></tr>"
        }
    }
}