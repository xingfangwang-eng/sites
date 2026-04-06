export interface CsvRow {
  [key: string]: string | number | boolean | null
}

export interface CleaningResult {
  totalRows: number
  removedRows: number
  cleanedRows: number
  removedGibberish: number
  removedShortContent: number
  removedDuplicates: number
  fixedDates: number
  cleanedData: CsvRow[]
  isOverLimit: boolean
  freeLimit: number
}

export interface CleaningProgress {
  stage: string
  current: number
  total: number
  message: string
}
