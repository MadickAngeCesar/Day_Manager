const { app, BrowserWindow } = require('electron');
const path = require('path');

let isDev;

(async () => {
    if (app.isPackaged) {
        isDev = false;
    } else {
        const { default: dev } = await import('electron-is-dev');
        isDev = dev;
    }

    console.log('Development mode:', isDev);

    app.on('ready', createWindow);
})();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : `file://${path.join(__dirname, 'dist/index.html')}`
    );

    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self';",
                    "script-src 'self';",
                    "style-src 'self' 'unsafe-inline';",
                    "img-src 'self' data:;",
                    "connect-src 'self' http://localhost:5000;",
                    "font-src 'self';",
                    "object-src 'none';"
                ].join(' '),
            },
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
