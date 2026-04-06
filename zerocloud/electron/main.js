const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const indexService = require('./services/index-service')
const searchService = require('./services/search-service')

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0a0b',
    frame: true,
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Set main window reference for search service
  searchService.setMainWindow(mainWindow)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Source Folder',
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

ipcMain.handle('index-directory', async (event, directoryPath) => {
  return new Promise((resolve) => {
    indexService.indexDirectory(directoryPath, (progress) => {
      if (mainWindow) {
        mainWindow.webContents.send('index-progress', progress)
      }
      
      if (progress.stage === 'completed' || progress.stage === 'error') {
        resolve(progress.stage === 'completed' ? { success: true } : { success: false, error: progress.error })
      }
    })
  })
})

ipcMain.handle('get-index-stats', async () => {
  return await indexService.getIndexStats()
})

ipcMain.handle('clear-index', async () => {
  await indexService.clearIndex()
  return { success: true }
})

ipcMain.handle('search', async (event, query) => {
  return new Promise((resolve) => {
    searchService.search(query)
      .then((result) => {
        if (mainWindow) {
          mainWindow.webContents.send('search-complete')
        }
        resolve(result)
      })
      .catch((error) => {
        console.error('Search failed:', error)
        resolve({ success: false, message: error.message })
      })
  })
})

// Handle streaming response from search service
if (process.send) {
  process.on('message', (message) => {
    if (message.type === 'search-chunk' && mainWindow) {
      mainWindow.webContents.send('search-chunk', message.chunk)
    }
  })
}
