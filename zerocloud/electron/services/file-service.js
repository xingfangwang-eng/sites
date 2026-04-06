const fs = require('fs')
const path = require('path')

class FileService {
  static async scanDirectory(directoryPath) {
    const files = []
    
    async function scan(dir) {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory()) {
          await scan(fullPath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase()
          if (ext === '.md' || ext === '.pdf') {
            const stats = await fs.promises.stat(fullPath)
            files.push({
              path: fullPath,
              name: entry.name,
              size: stats.size,
              mtime: stats.mtimeMs,
              extension: ext
            })
          }
        }
      }
    }
    
    await scan(directoryPath)
    return files
  }
  
  static async readTextFile(filePath) {
    return await fs.promises.readFile(filePath, 'utf8')
  }
  
  static async writeJsonFile(filePath, data) {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  }
  
  static async readJsonFile(filePath) {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  }
}

module.exports = FileService
