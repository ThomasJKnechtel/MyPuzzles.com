let countdown = async (countTime, timeIncrement)=>{
    let count = 0
    let timer = setInterval(()=>{
        count += timeIncrement
        let remainingTime = countTime-count
        let minutes = Math.floor(remainingTime/(60*1000))
        let seconds = Math.floor(remainingTime/1000)
        let millis = remainingTime%1000
        let strMinutes ='00'
        let strSeconds ='00'
        let strMillis = '000'
        if(minutes>0) strMinutes = minutes
        if(seconds>9) strSeconds = seconds
        else if(10>seconds>0) strSeconds = '0'+seconds
        if (millis>99) strMillis = millis
        else if(millis>9) strMillis= '0'+millis
        else if(10>millis>0) strMillis = '00'+millis

        document.getElementById("timerSec1").innerText=strMinutes
        document.getElementById("timerSec2").innerText=strSeconds
        document.getElementById("timerSec3").innerText=strMillis
        if(countTime<=count){
            clearInterval(timer)
        }
    }, timeIncrement)
}
