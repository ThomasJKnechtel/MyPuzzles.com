const submitForm = async function submitForm(){
    const formData = new FormData(document.getElementById("puzzleSearchForm"))
    formData.append('user_id','111')
    fetch('search_puzzles.html/search', {method:'POST', body:formData}).then(res => res.json()).then(puzzles =>{
        const handleDate = date => {return new Date(date).toDateString()}
        updateTable('tbody',puzzles, {'ignore':{'continuation':true}, 'handle':{'date':handleDate}})
    })
}
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