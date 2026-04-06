export interface ElectronAPI {
  selectFolder: () => Promise<string | null>
  indexDirectory: (directoryPath: string) => Promise<{ success: boolean; error?: string }>
  getIndexStats: () => Promise<{ fileCount: number; embeddingCount: number; lastUpdated: string | null }>
  clearIndex: () => Promise<{ success: boolean }>
  onIndexProgress: (callback: (progress: IndexProgress) => void) => void
  search: (query: string) => Promise<{ success: boolean; message?: string; matches?: { text: string; similarity: number }[] }>
  onSearchChunk: (callback: (chunk: string) => void) => void
  onSearchComplete: (callback: () => void) => void
}

export interface IndexProgress {
  stage: 'scanning' | 'processing' | 'completed' | 'error'
  status: string
  progress?: number
  currentFile?: string
  error?: string
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
