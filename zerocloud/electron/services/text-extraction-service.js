const fs = require('fs')

// Add polyfill to solve DOMMatrix and other browser API issues
if (typeof DOMMatrix === 'undefined') {
  global.DOMMatrix = class {
    constructor() {}
  }
}

if (typeof ImageData === 'undefined') {
  global.ImageData = class {
    constructor() {}
  }
}

if (typeof Path2D === 'undefined') {
  global.Path2D = class {
    constructor() {}
  }
}

let pdf = null
let pdfLoaded = false

// Dynamically load pdf-parse to avoid dependency issues at startup
async function loadPdfParse() {
  if (!pdfLoaded) {
    try {
      pdf = require('pdf-parse')
      pdfLoaded = true
    } catch (error) {
      console.warn('PDF parsing function not available, will skip PDF files:', error.message)
    }
  }
  return pdf
}

class TextExtractionService {
  static async extractTextFromFile(file) {
    if (file.extension === '.md') {
      return await this.extractFromMarkdown(file)
    } else if (file.extension === '.pdf') {
      return await this.extractFromPdf(file)
    }
    return null
  }
  
  static async extractFromMarkdown(file) {
    try {
      const content = await fs.promises.readFile(file.path, 'utf8')
      return {
        text: content,
        chunks: this.splitTextIntoChunks(content)
      }
    } catch (error) {
      console.error('Error extracting from markdown:', error)
      return null
    }
  }
  
  static async extractFromPdf(file) {
    try {
      const pdfModule = await loadPdfParse()
      if (!pdfModule) {
        console.warn('PDF parsing module not loaded, skipping file:', file.name)
        return null
      }
      
      const dataBuffer = await fs.promises.readFile(file.path)
      const data = await pdfModule(dataBuffer)
      
      return {
        text: data.text,
        chunks: this.splitTextIntoChunks(data.text)
      }
    } catch (error) {
      console.error('Error extracting from PDF:', error)
      return null
    }
  }
  
  static splitTextIntoChunks(text, chunkSize = 500) {
    const chunks = []
    const words = text.split(/\s+/)
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ')
      if (chunk.trim()) {
        chunks.push(chunk)
      }
    }
    
    return chunks
  }
}

module.exports = TextExtractionService
