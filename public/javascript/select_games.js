
const generatePuzzles = function(){
    const formData = new FormData(document.getElementById('gamePerameters'))
    const puzzles = fetch('select_games.html/generatePuzzles', {method:'Post', body: formData}).then(response => {
        if(response.status==200) response.json().then(json =>{console.log(json)})
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
