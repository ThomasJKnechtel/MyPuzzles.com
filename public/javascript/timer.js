/**
 * Sets a timer for a period of time and displays it in timer
 * @param {Number} countTime the total time to countdown from
 * @param {Number} timeIncrement how often to increment timer
 * @returns a Timer object
 */
const countdown = (countTime, timeIncrement, onTimeOut)=>{
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
            onTimeOut()
        }
    }, timeIncrement)
    return timer
}
/**
 * starts a stopwatch 
 * @param {Number} timeIncrement how often to update stopwatch
 * @returns {Timer} a stopwatch object
 */
const stopwatch = timeIncrement =>{
    const startTime = Date.now()
    let stopwatch = setInterval(()=>{
        const currentTime = Date.now()
        let timePassed = currentTime-startTime
        let hours = Math.floor(timePassed/(60*60*1000))
        let minutes = Math.floor(timePassed/(60*1000))
        let seconds = Math.floor(timePassed/(1000))
        let strHours = hours
        let strMinutes ='00'
        let strSeconds = '00'
        if(minutes>9) strMinutes=minutes
        else if(minutes>0) strMinutes='0'+minutes
        if(seconds>9) strSeconds= seconds
        else if(seconds>0) strSeconds = '0'+seconds
        
        document.getElementById("timerSec1").innerText=strMinutes
        document.getElementById("timerSec2").innerText=strSeconds
        document.getElementById("timerSec3").innerText=strMillis
        
    }, timeIncrement)
    return stopwatch
}