const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
const msmc = require("msmc");
const fetch = require("node-fetch");
const os = require("os");


const userHomeDir = os.homedir();

msmc.setFetch(fetch);

function quit() {
  app.quit();
  process.exit(0);
}
let opts = "";

let win = 0;
let launched = 0;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    resizable: false
  })

  win.loadFile('index.html')
}
// Attach listener in the main process with the given ID
ipcMain.on('test', (event, arg) => {
  console.log(arg);
});
var mc = 0;
ipcMain.on('launch', (event, arg) => {
  console.log("launching");
  console.log(arg);
  //console.log(Authenticator.getAuth(arg.username, arg.password));
  msmc.fastLaunch("raw",
    (update) => {
      //A hook for catching loading bar events and errors, standard with MSMC
      console.log("CallBack!!!!!")
      console.log(update)
    }).then(result => {
      //Let's check if we logged in?
      if (msmc.errorCheck(result)) {
        console.log(result.reason)
        return;
      }
      //If the login works
      let opts = {
        clientPackage: null,
        // Pulled from the Minecraft Launcher core docs , this function is the star of the show
        authorization: msmc.getMCLC().getAuth(result),
        root: path.join(userHomeDir, ".catmc"),//"./minecraft",
        //version: {
        //  number: "1.19.2",
        //  type: "release"
        //},
        memory: {
          max: "6G",
          min: "4G"
        }//,
        //server: {
          //host: "51.81.169.30"
        //}
      }
      console.log("Starting!")
      launcher.launch(opts);

      launcher.on('debug', (e) => console.log(e));
      launcher.on('data', (e) => console.log(e));
      launcher.on('close', (e) => quit())
    }).catch(reason => {
      //If the login fails
      console.log("We failed to log someone in because : " + reason);
      quit();
    })
  launched = 1;
  win.close();
});

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (launched == 0) {
    quit()
  }
})
