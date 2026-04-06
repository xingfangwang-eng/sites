class SimilarityService {
  static cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
    return similarity
  }

  static findTopKMatches(queryVector, vectors, k = 3) {
    const similarities = vectors.map(vec => ({
      vector: vec,
      similarity: this.cosineSimilarity(queryVector, vec)
    }))

    similarities.sort((a, b) => b.similarity - a.similarity)
    return similarities.slice(0, k)
  }
}

module.exports = SimilarityService
