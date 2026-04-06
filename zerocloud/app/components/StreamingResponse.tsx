'use client'

import { useState, useEffect, useRef } from 'react'

interface StreamingResponseProps {
  onComplete: () => void
}

export default function StreamingResponse({ onComplete }: StreamingResponseProps) {
  const [chunks, setChunks] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if in Electron environment
    if (typeof window !== 'undefined' && window.electronAPI) {
      // Listen to streaming response from main process
      const handleSearchChunk = (chunk: string) => {
        setChunks(prev => [...prev, chunk])
      }

      const handleSearchComplete = () => {
        setIsComplete(true)
        onComplete()
      }

      window.electronAPI.onSearchChunk?.(handleSearchChunk)
      window.electronAPI.onSearchComplete?.(handleSearchComplete)
    }

    return () => {
      // Electron IPC listeners are automatically cleaned up, no need to manually set to undefined
    }
  }, [onComplete])

  useEffect(() => {
    // Auto scroll to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [chunks])

  return (
    <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text">AI Response</h3>
        {isComplete && (
          <span className="text-xs text-textSecondary">✓ Complete</span>
        )}
      </div>

      <div 
        ref={containerRef}
        className="h-64 overflow-y-auto space-y-2 text-sm text-text leading-relaxed"
      >
        {chunks.length === 0 && !isComplete && (
          <div className="flex items-center justify-center h-full text-textSecondary">
            <div className="animate-pulse">Waiting for response...</div>
          </div>
        )}

        {chunks.map((chunk, index) => (
          <div
            key={index}
            className="typing-effect"
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          >
            {chunk}
          </div>
        ))}

        {isComplete && chunks.length > 0 && (
          <div className="text-center text-textSecondary text-xs mt-2">
            All content generated
          </div>
        )}
      </div>
    </div>
  )
}
