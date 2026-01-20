// main.js
const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Required for some newer features; can be left out for a simple start
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools (optional).
  // mainWindow.webContents.openDevTools();
}

// When the app is ready, run the createWindow function
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Re-create a window in the app when the dock icon is clicked (macOS)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
