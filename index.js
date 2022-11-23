// Application Main Requirements
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { readFileSync, writeFile, existsSync, unlinkSync } = require('fs');
// Application Constants
const Path = require('path');
const Configuration = require('./configuration.json');
const Axios = require('axios');
const DataPath = app.getPath('userData');
// Application Variables
let PluginName;
let MainWindow;
var qs = require('qs');
// WebService Creation
const WebService = Axios.create({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': Configuration.App.UserAgent },
    httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
});
// RPC Configuration Pull
if (Configuration.Discord.RichPresenceEnabled) {
    const DiscordRPC = require('discord-rpc');
    const clientId = Configuration.Discord.RichPresenceID;
    // Register & Call RPC Properties to Discord Client
    DiscordRPC.register(clientId);
    const RichPresence = new DiscordRPC.Client({ transport: 'ipc' });
    RichPresence.on('ready', () => {
        RichPresence.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: Configuration.Discord.RichPresenceDetailsOne,
                timestamps: {
                    start: Date.now()
                },
                assets: {
                    large_image: Configuration.Discord.RichPresenceLargeImage
                },
                buttons: [
                    {
                        label: Configuration.Discord.RichPresenceButtonFirstText,
                        url: Configuration.Discord.InviteURL
                    }
                ]
            }
        });
    });
    RichPresence.login({ clientId }).catch(console.error);
}
// Process Platforms
switch (process.platform) {
    case 'win32':
        if (process.arch === "x32" || process.arch === "ia32")
            PluginName = 'Windows/pepflashplayer-32.dll';
        else
            PluginName = 'Windows/pepflashplayer.dll';
        break;
    case 'darwin':
            PluginName = 'MacOS/PepperFlashPlayer.plugin';
        break;
    case "linux":
        if (process.arch === "arm")
            PluginName = 'Linux/libpepflashplayer_arm.so';
        else
            PluginName = 'Linux/libpepflashplayer_amd.so';
        break;
    case "freebsd":
    case "openbsd":
    case "netbsd":
        PluginName = 'libpepflashplayer.so';
        break;
}
// Application Shell for MacOS (Darwin Architecture)
if (process.platform !== 'darwin') {
    app.commandLine.appendSwitch('high-dpi-support', '1');
    app.commandLine.appendSwitch('force-device-scale-factor', '1');
}
// Application Shell
app.commandLine.appendSwitch('ppapi-flash-path', Path.join(__dirname.includes('.asar') ? process.resourcesPath : __dirname, 'PepperFlash/' + PluginName));
app.commandLine.appendSwitch('disable-site-isolation-trials');
// Create Graphical User Interface
let createWindow = async() => {
    MainWindow = new BrowserWindow({
        icon: Path.join(__dirname, '/icon.ico'),
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
            title: Configuration.Hotel.HotelName,
            plugins: true,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webviewTag: true,
            devTools: true
        },
        show: false,
        frame: false,
        backgroundColor: '#000',
    });
    // Main Window
    MainWindow.show();
    MainWindow.setMenu(null);
    MainWindow.on('closed', () => MainWindow = null);
    MainWindow.on('focus', () => MainWindow.flashFrame(false));
    MainWindow.webContents.userAgent = Configuration.App.UserAgent;
    // Main Window Loading
    await MainWindow.loadFile(Path.join(__dirname, 'GUI', 'index.html'));
    MainWindow.webContents.on('new-window', (url) => {
        console.log(url);
    });
    // Window IPC-Related/Button Handlers
    ipcMain.on('closeApp', () => {
        app.quit();
    });
    ipcMain.on('minimizeApp', () => {
        MainWindow.minimize();
    });
    ipcMain.on('helpCenter', () => {
        // External Links on Electron
        shell.openExternal(Configuration.Web.HelpCenter);
    });
    ipcMain.on('recoverPassword', () => {
        // External Links on Electron
        shell.openExternal(Configuration.Web.RecoverPasswordURL);
    });
    ipcMain.on('registerNow', () => {
        // External Links on Electron
        shell.openExternal(Configuration.Web.RegisterURL);
    });
}
// IPC Handlers
ipcMain.on('getConfig', (e) => {
    e.reply('setConfig', Configuration);
});
ipcMain.on('openClient', () => {
    MainWindow.maximize();
});
ipcMain.on('keepDataAlive', (e, data) => {
    writeFile(Path.join(DataPath, '/logindata.json'), JSON.stringify(data), (e) => {
        if (e) {
            throw e;
        }
    });
});
ipcMain.on('getData', (e) => {
    if (existsSync(Path.join(DataPath, '/logindata.json'))) {
        var info = JSON.parse(readFileSync(Path.join(DataPath, '/logindata.json'), 'utf8'));
        e.reply('setData', info);
    }
});
ipcMain.on('doNotKeepDataAlive', (e) => {
    if (existsSync(Path.join(DataPath, '/logindata.json'))) {
        unlinkSync(Path.join(DataPath, '/logindata.json'), (e) => {
            if (e) {
                throw e;
            }
        });
    }
    app.relaunch();
    app.exit(0);
    app.quit();
});
ipcMain.on('login', async(e, username, password) => {
    // Login Form
    const FormData = {
        username: username,
        password: password,
        csrftoken: "",
        remember_me: "false"
    };
    // Login Handler
    const Login = await WebService.post(`${Configuration.Web.HotelURL}/auth/login/request`, qs.stringify(FormData));
    const Cookie = Login.headers['set-cookie'][0];
    e.reply('loginCallback', Cookie, Login.data, Login.status);
});
ipcMain.on('clearCache', async() => {
    // Cache Information Collection & Clearing
    let Session = MainWindow.webContents.session;
    await Session.clearCache();
    MainWindow.webContents.session.clearStorageData();
    // Application Restart
    app.relaunch();
    app.exit(0);
    app.quit();
});
// Application Handlers
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.exit(0);
        app.quit();
    }
});
app.on('before-quit', () => {
    MainWindow.removeAllListeners('close');
    MainWindow.close();
});
app.on('activate', async() => {
    if (MainWindow === null) await createWindow();
});
// Memory Usage Resolver
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=524');
// App on Ready
app.on('ready', async () => {
    createWindow();
    //MainWindow.webContents.openDevTools();
});