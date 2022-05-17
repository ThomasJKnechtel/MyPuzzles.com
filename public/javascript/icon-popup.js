const setIcon = function(){
    const setIconSrc = (image_url) =>{ document.getElementById('icon').setAttribute('src', image_url)}
    fetch('report.html/authenticate', {method:'Post', headers:{'Content-Type':'application/json'}}).then(res => {
        if(res.status=204)  res.text().then(text => setIconSrc(text))
        else location.href.replace('http://localhost:7500/login.html')
    })
}
const signOut = function(){
    sessionStorage.clear()
    document.cookie = 'logged_in=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    window.location.href='http://localhost:7500/login.html'
}