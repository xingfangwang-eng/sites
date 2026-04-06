const path = require('path')
const FileService = require('./file-service')

class StorageService {
  constructor() {
    this.indexData = {
      files: [],
      embeddings: [],
      lastUpdated: null
    }
    this.storagePath = path.join(process.cwd(), 'index.json')
  }
  
  async loadFromDisk() {
    const data = await FileService.readJsonFile(this.storagePath)
    if (data) {
      this.indexData = data
    }
  }
  
  async saveToDisk() {
    this.indexData.lastUpdated = new Date().toISOString()
    await FileService.writeJsonFile(this.storagePath, this.indexData)
  }
  
  addFile(file, embeddings) {
    this.indexData.files.push({
      ...file,
      indexedAt: new Date().toISOString()
    })
    
    embeddings.forEach(embedding => {
      this.indexData.embeddings.push({
        fileId: file.path,
        ...embedding
      })
    })
  }
  
  clear() {
    this.indexData = {
      files: [],
      embeddings: [],
      lastUpdated: null
    }
  }
  
  getStats() {
    return {
      fileCount: this.indexData.files.length,
      embeddingCount: this.indexData.embeddings.length,
      lastUpdated: this.indexData.lastUpdated
    }
  }
  
  getAllData() {
    return this.indexData
  }
}

module.exports = new StorageService()
