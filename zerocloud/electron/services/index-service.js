const FileService = require('./file-service')
const TextExtractionService = require('./text-extraction-service')
const vectorService = require('./vector-service')
const storageService = require('./storage-service')

class IndexService {
  async indexDirectory(directoryPath, progressCallback) {
    try {
      // Scan files
      progressCallback({ stage: 'scanning', status: 'Scanning files...', progress: 0 })
      const files = await FileService.scanDirectory(directoryPath)
      
      if (files.length === 0) {
        progressCallback({ stage: 'completed', status: 'No files found for indexing', progress: 100 })
        return { success: false, message: 'No files found for indexing' }
      }
      
      // Clear existing index
      storageService.clear()
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const progress = Math.round((i / files.length) * 100)
        
        progressCallback({
          stage: 'processing',
          status: `Encrypting and indexing local files... [${i + 1}/${files.length}]`,
          progress,
          currentFile: file.name
        })
        
        // Extract text
        const textData = await TextExtractionService.extractTextFromFile(file)
        if (!textData || !textData.chunks || textData.chunks.length === 0) {
          console.warn(`Unable to extract file content: ${file.name}`)
          continue
        }
        
        // Generate vectors
        const embeddings = await vectorService.generateEmbeddingsForChunks(textData.chunks)
        if (embeddings.length === 0) {
          console.warn(`Unable to generate vectors: ${file.name}`)
          continue
        }
        
        // Store data
        storageService.addFile(file, embeddings)
      }
      
      // Save to disk
      await storageService.saveToDisk()
      
      progressCallback({
        stage: 'completed',
        status: `Indexing completed, processed ${files.length} files`,
        progress: 100
      })
      
      return {
        success: true,
        stats: storageService.getStats()
      }
      
    } catch (error) {
      console.error('Error during indexing:', error)
      progressCallback({
        stage: 'error',
        status: 'Error during indexing',
        error: error.message
      })
      return { success: false, message: error.message }
    }
  }
  
  async getIndexStats() {
    return storageService.getStats()
  }
  
  async clearIndex() {
    storageService.clear()
    await storageService.saveToDisk()
  }
}

module.exports = new IndexService()
