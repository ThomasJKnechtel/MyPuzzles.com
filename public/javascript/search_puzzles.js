const submitForm = async function submitForm(){
    const formData = new FormData(document.getElementById("puzzleSearchForm"))
    formData.append('user_id','111')
    fetch('search_puzzles.html/search', {method:'POST', body:formData}).then(res => res.json()).then(puzzles =>{
        const handleDate = date => {return new Date(date).toDateString()}
        updateTable('tbody',puzzles, {'ignore':{'continuation':true}, 'handle':{'date':handleDate}})
        let fens = Array.from(document.getElementsByClassName('fen'))
        fens.map(element => {
            element.onmouseover=hover
            element.onmouseleave=leave
        });
    })
}
let fens = Array.from(document.getElementsByClassName('fen'))
fens.map(element => {
    element.onmouseover=hover
    element.onmouseleave=leave
});
/**
 * 
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
    xpos = window.event.x + document.body.scrollLeft - 2;
    ypos = window.event.y + document.body.scrollTop - 2;
    const fen = this.innerHTML
    const boardDiv = document.createElement('div')
    boardDiv.id='myBoard'
    boardDiv.classList.add('board')
    boardDiv.style.position='absolute'
    boardDiv.style.left=xpos+'px'
    boardDiv.style.top=ypos-200+'px'
    boardDiv.style.width='200px'
    
    boardDiv.style.zIndex='1'
    document.getElementsByTagName("body")[0].innerHTML+=boardDiv.outerHTML
   
    
    const board = new ChessBoard('myBoard', fen)
}
const leave = function leave(elem){
    document.getElementById('myBoard').outerHTML=''
}