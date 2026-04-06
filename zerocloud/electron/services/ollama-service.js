const http = require('http')

class OllamaService {
  constructor() {
    this.baseUrl = 'http://localhost:11434'
    this.timeout = 5000
  }

  async isOnline() {
    try {
      const response = await this._request('GET', '/api/tags')
      return response.statusCode === 200
    } catch (error) {
      console.error('Ollama check failed:', error.message)
      return false
    }
  }

  async generateResponse(prompt, context, onChunk) {
    try {
      const fullPrompt = this._buildPrompt(prompt, context)
      const response = await this._request('POST', '/api/generate', {
        model: 'llama3',
        prompt: fullPrompt,
        stream: true
      })

      if (response.statusCode !== 200) {
        throw new Error(`Ollama API error: ${response.statusCode}`)
      }

      // Handle streaming response
      let buffer = ''

      response.on('data', (chunk) => {
        buffer += chunk
        const lines = buffer.split('\n')
        
        // Send complete lines
        for (const line of lines) {
          if (line.trim()) {
            onChunk(line)
          }
        }
        
        // Keep the last incomplete line
        const lastLine = lines[lines.length - 1]
        if (lastLine) {
          buffer = lastLine
        } else {
          buffer = ''
        }
      })

      return { success: true }
    } catch (error) {
      console.error('Ollama generation failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  _buildPrompt(prompt, context) {
    return `Answer the question based on the following context, do not make up information. If the context is insufficient, please state directly.

Context:
${context.map((chunk, index) => `[Fragment ${index + 1}]:\n${chunk}`).join('\n\n')}

Question: ${prompt}`
  }

  _request(method, endpoint, data = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 11434,
        path: endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: this.timeout
      }

      if (method === 'POST' && data) {
        options.body = JSON.stringify(data)
      }

      const req = http.request(options, (res) => {
        let responseData = ''

        res.on('data', (chunk) => {
          responseData += chunk
        })

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve({
                statusCode: res.statusCode,
                data: responseData
              })
            } catch (error) {
              resolve({
                statusCode: res.statusCode,
                data: responseData
              })
            }
          } else {
            reject(new Error(`Request failed: ${res.statusCode}`))
          }
        })

        req.on('error', reject)
      })

      req.on('timeout', () => {
        reject(new Error('Request timeout'))
      })
    })
  }
}

module.exports = new OllamaService()
