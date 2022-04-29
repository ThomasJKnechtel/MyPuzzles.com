let countdown = (countTime, timeIncrement, elementID)=>{
    let count = 0
    let timer = setInterval(()=>{
        count += timeIncrement
        let remainingTime = countTime-count
        document.getElementById(elementID).innerText=Math.floor(remainingTime/1000)+":"+remainingTime%1000
        if(countTime<=count){
            clearInterval(timer)
        }
    }, timeIncrement)
}
