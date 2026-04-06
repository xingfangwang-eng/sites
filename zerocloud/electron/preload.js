const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  indexDirectory: (directoryPath) => ipcRenderer.invoke('index-directory', directoryPath),
  getIndexStats: () => ipcRenderer.invoke('get-index-stats'),
  clearIndex: () => ipcRenderer.invoke('clear-index'),
  onIndexProgress: (callback) => ipcRenderer.on('index-progress', (event, progress) => callback(progress)),
  search: (query) => ipcRenderer.invoke('search', query),
  onSearchChunk: (callback) => ipcRenderer.on('search-chunk', (event, chunk) => callback(chunk)),
  onSearchComplete: (callback) => ipcRenderer.on('search-complete', () => callback())
})
