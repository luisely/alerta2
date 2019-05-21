const { app, Menu, Tray, BrowserWindow } = require('electron');
const request = require('request');


let tray = null;
app.on('window-all-closed', e => e.preventDefault())


app.on('ready', () => {

    alertaWindow = new BrowserWindow({
        alwaysOnTop: true,
        width: 1100,
        height: 600,
        titleBarStyle: 'hidden',
        maximizable: false,
        fullscreenable: false,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: false
        }
    })

    alertaWindow.on('close', function (event) {
        event.preventDefault();
        alertaWindow.hide();
    });

    //alertaWindow.hide()
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: () => { app.quit(); } }
    ]);
    tray = new Tray('ok.ico');
    tray.setContextMenu(contextMenu);

    const getStatus = () => {
        //console.log('iniciou o update')
        if (BrowserWindow.getAllWindows() >= 1) {
            alertaWindow.hide()
        }
        request({
            url: 'http://192.168.1.56/arquivos/avisos/electron.txt',
            //headers: { 'CB-VERSION': '2017-08-04' },
        }, (err, res, body) => {
            if (err) {
                tray.setToolTip('Error getting market price.');
            } else {
                const status = body;
                tray.setToolTip(`Status: ${status}`);
                if (status == 1) {
                    tray.setImage('fail.ico')
                    alertaWindow.setIcon('fail.ico')
                    alertaWindow.setMenuBarVisibility(false)
                    alertaWindow.loadURL('http://infra.imdepa.com.br/aviso.html')
                    alertaWindow.show()
                    //console.log('Aqui')
                }
                if (status == 2) {
                    tray.setImage('ok.ico')
                    alertaWindow.setIcon('ok.ico')
                    alertaWindow.setMenuBarVisibility(false)
                    alertaWindow.loadURL('http://infra.imdepa.com.br/liberado.html')
                    alertaWindow.show()
                }
                if (status == 0) {
                    let telasAbertas = BrowserWindow.getAllWindows()
                    if (telasAbertas >= 1) {
                        alertaWindow.hide()
                    }
                    tray.setImage('ok.ico')
                    //console.log(telasAbertas)
                }
            }
        });
        setTimeout(getStatus, 200000);
        //console.log('Acabou o update')
    };
    getStatus();
});