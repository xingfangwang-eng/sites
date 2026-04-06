'use client'

import { useState, useEffect } from 'react'
import type { IndexProgress } from '@/types/electron'
import StreamingResponse from './components/StreamingResponse'

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [progress, setProgress] = useState<IndexProgress | null>(null)
  const [indexStats, setIndexStats] = useState<{
    fileCount: number
    embeddingCount: number
    lastUpdated: string | null
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{ success: boolean; message?: string; matches?: { text: string; similarity: number }[] } | null>(null)
  const [showStreamingResponse, setShowStreamingResponse] = useState(false)
  const [showProModal, setShowProModal] = useState(false)

  useEffect(() => {
    // Check if in Electron environment
    if (typeof window !== 'undefined' && window.electronAPI) {
      // Listen to index progress
      window.electronAPI.onIndexProgress((progress) => {
        setProgress(progress)
        if (progress.stage === 'completed' || progress.stage === 'error') {
          setIsIndexing(false)
          // Get index statistics
          if (window.electronAPI) {
            window.electronAPI.getIndexStats().then(setIndexStats)
          }
        }
      })

      // Get index statistics on initialization
      window.electronAPI.getIndexStats().then(setIndexStats)
    }
  }, [])

  const handleSelectFolder = async () => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      alert('This feature is only available in the desktop app')
      return
    }
    
    setIsLoading(true)
    try {
      const path = await window.electronAPI.selectFolder()
      if (path) {
        setSelectedFolder(path)
        startIndexing(path)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startIndexing = async (directoryPath: string) => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      alert('This feature is only available in the desktop app')
      return
    }
    
    setIsIndexing(true)
    try {
      await window.electronAPI.indexDirectory(directoryPath)
    } catch (error) {
      console.error('Indexing failed:', error)
    }
  }

  const handleClearIndex = async () => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      alert('This feature is only available in the desktop app')
      return
    }
    
    try {
      await window.electronAPI.clearIndex()
      setIndexStats({ fileCount: 0, embeddingCount: 0, lastUpdated: null })
      setSelectedFolder(null)
    } catch (error) {
      console.error('Failed to clear index:', error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    if (typeof window === 'undefined' || !window.electronAPI) {
      alert('This feature is only available in the desktop app')
      return
    }

    setIsSearching(true)
    setShowStreamingResponse(true)
    
    try {
      const result = await window.electronAPI.search(searchQuery)
      setSearchResult(result)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResult({ success: false, message: 'Search failed' })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchComplete = () => {
    setShowStreamingResponse(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl flex-1 flex flex-col">
        <div className="glass rounded-2xl p-8 text-center flex-1 relative">
          {/* Pro Plan icon */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowProModal(true)}
              className="px-3 py-1 text-xs font-medium bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
            >
              Pro Plan
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-text mb-2">ZeroCloud.so</h1>
            <p className="text-textSecondary text-sm">100% Offline Document Intelligence</p>
          </div>

          <button
            onClick={handleSelectFolder}
            disabled={isLoading || isIndexing}
            className="group relative w-full py-6 px-8 bg-surfaceHighlight hover:bg-surface border border-border rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <svg
                className="w-6 h-6 text-textSecondary group-hover:text-text transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-lg font-medium text-text">
                {isLoading ? 'Loading...' : isIndexing ? 'Indexing...' : 'Select Source Folder'}
              </span>
            </div>
          </button>

          {selectedFolder && (
            <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
              <p className="text-sm text-textSecondary mb-1">Current Folder</p>
              <p className="text-sm text-text font-mono break-all">{selectedFolder}</p>
            </div>
          )}

          {isIndexing && progress && (
            <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <p className="text-sm text-textSecondary">Status</p>
                  <p className="text-sm text-text font-medium">{progress.status}</p>
                  {progress.currentFile && (
                    <p className="text-xs text-textSecondary mt-1">Current: {progress.currentFile}</p>
                  )}
                </div>
                
                {progress.progress !== undefined && (
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-textSecondary mb-1">
                      <span>{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-surfaceHighlight rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-200"
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {progress?.stage === 'error' && (
            <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-800/30">
              <p className="text-sm text-red-400">Error: {progress.error}</p>
            </div>
          )}

          {indexStats && indexStats.fileCount > 0 && (
            <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
              <p className="text-sm text-textSecondary mb-2">Index Stats</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-textSecondary">Files</p>
                  <p className="text-text font-medium">{indexStats.fileCount}</p>
                </div>
                <div>
                  <p className="text-textSecondary">Embeddings</p>
                  <p className="text-text font-medium">{indexStats.embeddingCount}</p>
                </div>
              </div>
              {indexStats.lastUpdated && (
                <p className="text-xs text-textSecondary mt-2">
                  Last updated: {new Date(indexStats.lastUpdated).toLocaleString()}
                </p>
              )}
              <button
                onClick={handleClearIndex}
                className="mt-4 px-4 py-2 text-xs text-textSecondary hover:text-text border border-border rounded-md transition-colors"
              >
                Clear Index
              </button>
            </div>
          )}

          <div className="mt-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your question..."
                  disabled={isSearching}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-accent hover:bg-accent/90 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isSearching ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          {showStreamingResponse && (
            <div className="mt-6">
              <StreamingResponse onComplete={handleSearchComplete} />
            </div>
          )}

          {searchResult && !showStreamingResponse && (
            <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
              {searchResult.success ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Search Results</h3>
                  {searchResult.matches && searchResult.matches.map((match, index) => (
                    <div key={index} className="p-3 bg-surfaceHighlight rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-accent">Match: {Math.round(match.similarity * 100)}%</span>
                        <span className="text-xs text-textSecondary">Fragment {index + 1}</span>
                      </div>
                      <p className="text-sm text-text">{match.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <p className="text-sm text-red-400">{searchResult.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="py-6 w-full text-center">
        <p className="text-xs text-textSecondary">100% Offline. Zero Data Leaves This Machine.</p>
        <p className="text-xs text-textSecondary mt-2">support: 457239850@qq.com</p>
      </footer>

      {/* Pro Plan modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-text">Pro Plan</h3>
              <button
                onClick={() => setShowProModal(false)}
                className="text-textSecondary hover:text-text transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-text text-center">
                Support independent developers to continue updates. One-time purchase for permanent license: $29
              </p>

              <a
                href="https://www.paypal.com/paypalme/xingfang.wang@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
              >
                Pay with PayPal
              </a>

              <div className="space-y-2">
                <label className="text-sm text-textSecondary block">Activation Code</label>
                <input
                  type="text"
                  placeholder="Enter the activation code received after payment"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button className="w-full py-2 px-4 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors mt-2">
                  Activate Pro Version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
