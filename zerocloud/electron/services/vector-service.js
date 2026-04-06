class VectorService {
  constructor() {
    this.embeddingPipeline = null
    this.transformers = null
  }
  
  async initialize() {
    if (!this.transformers) {
      this.transformers = await import('@xenova/transformers')
    }
    
    if (!this.embeddingPipeline) {
      this.embeddingPipeline = await this.transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    }
  }
  
  async generateEmbedding(text) {
    await this.initialize()
    
    try {
      const result = await this.embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true
      })
      
      return Array.from(result.data)
    } catch (error) {
      console.error('Error generating embedding:', error)
      return null
    }
  }
  
  async generateEmbeddingsForChunks(chunks) {
    const embeddings = []
    
    for (const chunk of chunks) {
      const embedding = await this.generateEmbedding(chunk)
      if (embedding) {
        embeddings.push({
          text: chunk,
          embedding
        })
      }
    }
    
    return embeddings
  }
}

module.exports = new VectorService()
