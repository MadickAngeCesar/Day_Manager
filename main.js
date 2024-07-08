const { app, BrowserWindow } = require('electron');
const path = require('path');

let isDev;

// Utilisez une fonction asynchrone auto-exécutante
(async () => {
    if (app.isPackaged) {
        isDev = false;
    } else {
        // Utilisez une importation dynamique avec 'import()'
        const { default: dev } = await import('electron-is-dev');
        isDev = dev;
    }

    // Maintenant, utilisez 'isDev' comme nécessaire dans votre application
    console.log('Mode de développement :', isDev);

    // Créer la fenêtre une fois que isDev est défini
    createWindow();
})();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false, // Disable web security to avoid CSP issues
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : `file://${path.join(__dirname, 'dist/index.html')}`
    );

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              "default-src 'self';",
              "script-src 'self';",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data:;",
              "connect-src 'self' http://localhost:5000;", // Allow connections to localhost:5000
              "font-src 'self';",
              "object-src 'none';"
            ].join(' ')
          }
        });
      });
}

app.on('ready', () => {
    // La logique asynchrone est exécutée avant la création de la fenêtre
});

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
