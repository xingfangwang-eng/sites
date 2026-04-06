import Papa from 'papaparse'
import { CsvRow, CleaningResult, CleaningProgress } from '@/types/csv'

function detectGibberish(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  
  const totalChars = text.length
  if (totalChars === 0) return false
  
  let nonUtf8Count = 0
  let controlCharCount = 0
  let consecutiveInvalid = 0
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    
    if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
      controlCharCount++
      consecutiveInvalid++
    } else if (charCode >= 0xD800 && charCode <= 0xDFFF) {
      nonUtf8Count++
      consecutiveInvalid++
    } else if (charCode > 0x10FFFF) {
      nonUtf8Count++
      consecutiveInvalid++
    } else {
      consecutiveInvalid = 0
    }
    
    if (consecutiveInvalid >= 3) return true
  }
  
  const invalidRatio = (nonUtf8Count + controlCharCount) / totalChars
  return invalidRatio > 0.15
}

function isShortContent(row: CsvRow): boolean {
  const content = Object.values(row).join(' ').trim()
  return content.length < 10
}

function normalizeDate(value: string): string {
  if (!value || typeof value !== 'string') return value
  
  const trimmed = value.trim()
  
  const datePatterns = [
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{2})\b/,
    /^(\d{4})(\d{2})(\d{2})$/,
  ]
  
  for (const pattern of datePatterns) {
    const match = trimmed.match(pattern)
    if (match) {
      let year: string, month: string, day: string
      
      if (pattern === datePatterns[0] || pattern === datePatterns[3]) {
        year = match[1]
        month = match[2].padStart(2, '0')
        day = match[3].padStart(2, '0')
      } else if (pattern === datePatterns[2]) {
        year = match[3].length === 2 ? '20' + match[3] : match[3]
        month = match[1].padStart(2, '0')
        day = match[2].padStart(2, '0')
      } else {
        year = match[3]
        month = match[1].padStart(2, '0')
        day = match[2].padStart(2, '0')
      }
      
      const yearNum = parseInt(year)
      if (yearNum >= 1900 && yearNum <= 2100) {
        return `${year}-${month}-${day}`
      }
    }
  }
  
  return trimmed
}

function generateRowHash(row: CsvRow): string {
  const normalized = Object.values(row)
    .map(v => String(v || '').trim().toLowerCase())
    .join('|')
  
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return hash.toString(36)
}

export async function cleanCsvData(
  file: File,
  onProgress?: (progress: CleaningProgress) => void
): Promise<CleaningResult> {
  return new Promise((resolve, reject) => {
    let totalRows = 0
    let removedGibberish = 0
    let removedShortContent = 0
    let removedDuplicates = 0
    let fixedDates = 0
    const FREE_LIMIT = 1000
    let rawData: CsvRow[] = []

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          rawData = results.data as CsvRow[]
          totalRows = rawData.length
          const isOverLimit = totalRows > FREE_LIMIT

          onProgress?.({
            stage: 'scanning',
            current: 0,
            total: totalRows,
            message: `Scanning ${totalRows.toLocaleString()} rows...`
          })

          const seenHashes = new Set<string>()
          const cleanedData: CsvRow[] = []

          for (let i = 0; i < rawData.length; i++) {
            if (isOverLimit && i >= FREE_LIMIT) {
              break
            }

            onProgress?.({
              stage: 'cleaning',
              current: i + 1,
              total: totalRows,
              message: `Scanning ${totalRows.toLocaleString()} rows... ${removedGibberish + removedShortContent + removedDuplicates} noisy rows removed.`
            })

            const row = rawData[i]

            let shouldRemove = false

            for (const [key, value] of Object.entries(row)) {
              if (typeof value === 'string') {
                if (detectGibberish(value)) {
                  removedGibberish++
                  shouldRemove = true
                  break
                }

                const normalized = normalizeDate(value)
                if (normalized !== value.trim()) {
                  row[key] = normalized
                  fixedDates++
                }
              }
            }

            if (shouldRemove) continue

            if (isShortContent(row)) {
              removedShortContent++
              continue
            }

            const rowHash = generateRowHash(row)
            
            if (seenHashes.has(rowHash)) {
              removedDuplicates++
              continue
            }

            seenHashes.add(rowHash)
            cleanedData.push(row)
          }

          const removedRows = removedGibberish + removedShortContent + removedDuplicates

          const result: CleaningResult = {
            totalRows,
            removedRows,
            cleanedRows: cleanedData.length,
            removedGibberish,
            removedShortContent,
            removedDuplicates,
            fixedDates,
            cleanedData,
            isOverLimit,
            freeLimit: FREE_LIMIT
          }

          rawData = []
          resolve(result)
        } catch (error) {
          rawData = []
          reject(error)
        }
      },
      error: (error) => {
        rawData = []
        reject(error)
      }
    })
  })
}

export function downloadCleanedCsv(data: CsvRow[], filename: string = 'cleaned.csv') {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function downloadJsonl(data: CsvRow[], filename: string = 'cleaned.jsonl') {
  const jsonl = data.map(row => JSON.stringify(row)).join('\n')
  const blob = new Blob([jsonl], { type: 'application/jsonl;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
