const SimilarityService = require('./similarity-service')
const OllamaService = require('./ollama-service')
const storageService = require('./storage-service')

class SearchService {
  constructor() {
    this.mainWindow = null
  }

  setMainWindow(window) {
    this.mainWindow = window
  }

  search(query) {
    return new Promise(async (resolve) => {
      try {
        // 1. Check if Ollama is online
        const isOllamaOnline = await OllamaService.isOnline()
        
        // 2. Vectorize query
        const queryVector = this._vectorizeQuery(query)
        if (!queryVector) {
          resolve({ success: false, message: 'Unable to vectorize query' })
          return
        }
        
        // 3. Get local index
        const indexData = storageService.getAllData()
        if (!indexData || !indexData.embeddings || indexData.embeddings.length === 0) {
          resolve({ success: false, message: 'Please select a folder and build index first' })
          return
        }
        
        // 4. Calculate similarity
        const matches = SimilarityService.findTopKMatches(
          queryVector,
          indexData.embeddings.map(e => e.embedding),
          3
        )
        
        if (matches.length === 0) {
          resolve({ success: false, message: 'No relevant content found' })
          return
        }
        
        // 5. Build Prompt
        const context = matches.map((match, index) => 
          `[Fragment ${index + 1}]:\n${match.text}`
        )
        
        // 6. Generate response
        if (isOllamaOnline) {
          const result = await OllamaService.generateResponse(
            query,
            context,
            (chunk) => this._streamChunk(chunk)
          )
          
          resolve({
            success: result.success,
            message: result.error || null,
            isOnline: true
          })
        } else {
          resolve({
            success: false,
            message: 'Please start Ollama for deep AI answers, or view matching fragments directly',
            matches: matches.map(m => ({
              text: m.text,
              similarity: m.similarity
            }))
          })
        }
        
      } catch (error) {
        console.error('Search failed:', error)
        resolve({ success: false, message: error.message })
      }
    })
  }
  
  _vectorizeQuery(text) {
    // Simplified vectorization, only for questions
    const words = text.toLowerCase().split(/\s+/)
    const wordCounts = {}
    
    for (const word of words) {
      if (word.length > 2) {
        wordCounts[word] = (wordCounts[word] || 0) + 1
      }
    }
    
    // Create 384-dimensional vector (simplified version)
    const vector = new Array(384).fill(0)
    for (const [word, count] of Object.entries(wordCounts)) {
      const hash = this._simpleHash(word)
      const index = hash % 384
      vector[index] = Math.min(count / 10, 1) // Normalization
    }
    
    // Normalization
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= norm
      }
    }
    
    return vector
  }
  
  _simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash >>> 0
    }
    return Math.abs(hash)
  }
  
  _streamChunk(chunk) {
    // Send streaming response to render process
    if (this.mainWindow) {
      this.mainWindow.webContents.send('search-chunk', chunk)
    }
  }
}

module.exports = new SearchService()
