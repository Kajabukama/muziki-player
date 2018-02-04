const { remote } = require('electron');
const ipc = require('electron').ipcRenderer;
var win = remote.getCurrentWindow();

var title = document.getElementById('title').innerHTML;
var minimize = document.getElementById('minimize');
var close = document.getElementById('close');
var maximize = document.getElementById('maximize');

var infoAbout = document.getElementById('infoAboutBtn');
var openFolder = document.getElementById('openFolderBtn');
var showMenu =  document.getElementById('show-menu');

document.getElementById('titleShown').innerHTML = title;

infoAbout.addEventListener('click', function () {
    $('#about').modal({
        blurring: false
    }).modal('show');
})

showMenu.addEventListener('click', function (){
    $('.ui.dropdown').dropdown();
});

openFolder.addEventListener('click', function (){
    ipc.send('open-folder-content');
});

// menu commands
minimize.addEventListener('click', function (){
    win.minimize();
})

maximize.addEventListener('click', function (){
    if (!win.isMaximizable()) {
        $('#maximizeInfo').modal({
            inverted: false
        }).modal('show');
        return false;
    } else {
        if (!win.isMaximized()) {
            win.maximize()
        }
        else{
            win.unmaximize();
        }
    }
})

close.addEventListener('click', function (){
    win.close();
})
