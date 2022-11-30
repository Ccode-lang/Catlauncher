window.ipcRenderer.send('test', "coms working");

var launchbutton = document.getElementById("launchbutton");
let struc = {}
launchbutton.onclick = function() {
    struc = {
        server: "main"
    }
    window.ipcRenderer.send("launch", struc);
}