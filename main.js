const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');

let win, winAbout


function createWindow () {

    win = new BrowserWindow({
        maximizable: false,
        resizable:false,
        frame: false,
        width: 1380,
        height: 820,
        backgroundColor: '#1e272e'
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools({detach: true})
    win.on('closed', () => {
        win = null
    })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('open-folder-content', function(){
    openFolderDialog();
})

function openFolderDialog(){
    dialog.showOpenDialog(win, {
        properties: ['openDirectory']
    }, function (filePath) {
        fs.readdir(filePath[0], function (err, files) {
            var arr = [];
            for(var i = 0; i < files.length; i++){
                if (files[i].substr(-4) === '.mp3') {
                    arr.push(files[i]);
                }
            }
            var objectToSend = {};
            objectToSend.files = arr;
            objectToSend.path = filePath[0];
            win.webContents.send('modal-file-content', objectToSend);

        })
        console.log(filePath[0]);
    })
    return false;
}
