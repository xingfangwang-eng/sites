'use client'

import { useState, useCallback, useRef } from 'react'
import { cleanCsvData, downloadCleanedCsv, downloadJsonl } from '@/utils/csvCleaner'
import { CleaningResult, CleaningProgress } from '@/types/csv'
import { logger } from '@/utils/logger'
import { perfMonitor } from '@/utils/performance'

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isCleaning, setIsCleaning] = useState(false)
  const [progress, setProgress] = useState<CleaningProgress | null>(null)
  const [result, setResult] = useState<CleaningResult | null>(null)
  const [showOpenAIConversion, setShowOpenAIConversion] = useState(false)
  const [promptColumn, setPromptColumn] = useState<string>('')
  const [completionColumn, setCompletionColumn] = useState<string>('')
  const [openaiPreview, setOpenaiPreview] = useState<any[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadedFile(files[0])
    }
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
      await startCleaning(files[0])
    }
  }

  const startCleaning = async (file: File) => {
    setIsCleaning(true)
    setProgress(null)
    setResult(null)
    setShowPaymentModal(false)
    setShowUnlockModal(false)

    logger.info('Starting CSV cleaning', { fileName: file.name, fileSize: file.size })

    try {
      const cleaningResult = await perfMonitor.measureAsync('CSV Cleaning', async () => {
        return await cleanCsvData(file, (progress) => {
          setProgress(progress)
          logger.debug('Cleaning progress', progress)
        })
      })
      
      setResult(cleaningResult)
      logger.info('CSV cleaning completed', cleaningResult)
      
      if (cleaningResult.isOverLimit) {
        setShowPaymentModal(true)
        logger.warn('File exceeds free limit', { totalRows: cleaningResult.totalRows })
      }
    } catch (error) {
      logger.error('Cleaning failed', error)
      alert('Failed to clean the file. Please try again.')
    } finally {
      setIsCleaning(false)
    }
  }

  const handleDownloadCsv = () => {
    if (result && result.totalRows <= 1000) {
      logger.info('Downloading CSV', { fileName: uploadedFile?.name })
      downloadCleanedCsv(result.cleanedData, `cleaned_${uploadedFile?.name}`)
    } else if (result && result.totalRows > 1000) {
      logger.warn('Download blocked - exceeds free limit', { totalRows: result.totalRows })
      setShowUnlockModal(true)
    }
  }

  const handleDownloadJsonl = () => {
    if (result && result.totalRows <= 1000) {
      logger.info('Downloading JSONL', { fileName: uploadedFile?.name })
      downloadJsonl(result.cleanedData, `cleaned_${uploadedFile?.name?.replace('.csv', '')}.jsonl`)
    } else if (result && result.totalRows > 1000) {
      logger.warn('Download blocked - exceeds free limit', { totalRows: result.totalRows })
      setShowUnlockModal(true)
    }
  }

  const handleShareOnX = () => {
    logger.info('Sharing on X', { totalRows: result?.totalRows })
    const text = `Just cleaned ${result?.totalRows.toLocaleString()} rows of CSV data in seconds with CleanCSV.ai! 🚀 #AI #DataCleaning #LLM`
    const url = 'https://cleancsv.ai'
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const handleReset = () => {
    setUploadedFile(null)
    setProgress(null)
    setResult(null)
    setIsCleaning(false)
    setShowOpenAIConversion(false)
    setPromptColumn('')
    setCompletionColumn('')
    setOpenaiPreview([])
    setShowPaymentModal(false)
    setShowUnlockModal(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getColumnNames = () => {
    if (!result || result.cleanedData.length === 0) return []
    return Object.keys(result.cleanedData[0])
  }

  const handleOpenAIConversion = () => {
    setShowOpenAIConversion(true)
    setOpenaiPreview([])
  }

  const handleConvertToOpenAI = () => {
    if (!result || !promptColumn || !completionColumn) {
      alert('Please select both Prompt and Completion columns')
      return
    }

    const converted = result.cleanedData.map(row => ({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: String(row[promptColumn] || '')
        },
        {
          role: 'assistant',
          content: String(row[completionColumn] || '')
        }
      ]
    }))

    setOpenaiPreview(converted.slice(0, 5))

    const jsonl = converted.map(item => JSON.stringify(item)).join('\n')
    const blob = new Blob([jsonl], { type: 'application/jsonl;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `openai_${uploadedFile?.name?.replace('.csv', '')}.jsonl`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const handleCancelOpenAI = () => {
    setShowOpenAIConversion(false)
    setPromptColumn('')
    setCompletionColumn('')
    setOpenaiPreview([])
  }

  return (
    <main className="min-h-screen bg-white bg-grid-gradient bg-grid">
      <div className="flex flex-col items-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Clean Messy CSV for AI Training in Seconds
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Automatically remove gibberish, duplicates, and short content. Perfect for preparing clean training data for LLM fine-tuning.
            </p>
          </div>

          {isCleaning && progress && (
            <div className="w-full max-w-2xl mx-auto mb-8 p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-900 text-sm font-medium uppercase tracking-wider">
                  {progress.stage}
                </span>
                <span className="text-slate-500 text-sm font-mono">
                  {progress.current.toLocaleString()} / {progress.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-slate-600 text-sm text-center">
                {progress.message}
              </p>
            </div>
          )}

          {result && !isCleaning && (
            <div className="w-full max-w-2xl mx-auto mb-8 p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
              <div className="text-center mb-6">
                <div className="text-indigo-500 text-5xl mb-3">✓</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Cleaning Complete!</h2>
                <p className="text-slate-500 font-mono">
                  {uploadedFile?.name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium mb-1">Total Rows</p>
                  <p className="text-slate-900 text-2xl font-bold font-mono">
                    {result.totalRows.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium mb-1">Cleaned Rows</p>
                  <p className="text-slate-900 text-2xl font-bold font-mono">
                    {result.cleanedRows.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium mb-1">Removed</p>
                  <p className="text-red-500 text-2xl font-bold font-mono">
                    {result.removedRows.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium mb-1">Fixed Dates</p>
                  <p className="text-slate-900 text-2xl font-bold font-mono">
                    {result.fixedDates.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Gibberish rows removed:</span>
                  <span className="font-mono text-slate-900">{result.removedGibberish.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Short content removed:</span>
                  <span className="font-mono text-slate-900">{result.removedShortContent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duplicates removed:</span>
                  <span className="font-mono text-slate-900">{result.removedDuplicates.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleDownloadCsv}
                  disabled={result.totalRows > 1000}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
                    result.totalRows > 1000
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  Download CSV
                </button>
                <button
                  onClick={handleDownloadJsonl}
                  disabled={result.totalRows > 1000}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
                    result.totalRows > 1000
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Download JSONL
                </button>
              </div>

              <button
                onClick={handleOpenAIConversion}
                className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Convert to OpenAI JSONL
              </button>
            </div>
          )}

          {showOpenAIConversion && result && (
            <div className="w-full max-w-2xl mx-auto mb-8 p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Convert to OpenAI JSONL</h2>
                <button
                  onClick={handleCancelOpenAI}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Select Prompt Column
                  </label>
                  <select
                    value={promptColumn}
                    onChange={(e) => setPromptColumn(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Column --</option>
                    {getColumnNames().map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Select Completion Column
                  </label>
                  <select
                    value={completionColumn}
                    onChange={(e) => setCompletionColumn(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Column --</option>
                    {getColumnNames().map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleConvertToOpenAI}
                className="w-full bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!promptColumn || !completionColumn}
              >
                Convert & Download
              </button>

              {openaiPreview.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-slate-700 text-sm font-medium mb-3">Preview (First 5 rows):</h3>
                  <div className="bg-slate-50 rounded-lg p-4 overflow-auto max-h-80 border border-slate-100">
                    {openaiPreview.map((item, index) => (
                      <div key={index} className="mb-4 pb-4 border-b border-slate-200 last:border-0 last:mb-0 last:pb-0">
                        <pre className={`text-slate-600 text-xs font-mono whitespace-pre-wrap ${result?.isOverLimit ? 'blur-sm' : ''}`}>
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showUnlockModal && result && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white border-2 border-indigo-500 rounded-lg p-8 max-w-md w-full shadow-soft-xl">
                <div className="text-center mb-6">
                  <div className="text-indigo-500 text-6xl mb-4">🔓</div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Your dataset is massive ({result.totalRows.toLocaleString()} rows)
                  </h2>
                  <p className="text-slate-600 text-lg mb-2">
                    We just saved you 1 hour of manual cleaning.
                  </p>
                  <p className="text-slate-500 text-sm">
                    Unlock full download for $5.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href="https://paypal.me/xingfangwang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-indigo-500 text-white font-semibold py-4 px-6 rounded-lg hover:bg-indigo-600 transition-colors text-center text-lg"
                  >
                    Pay $5 via PayPal
                  </a>
                  <button
                    onClick={handleShareOnX}
                    className="w-full bg-black text-white font-semibold py-4 px-6 rounded-lg hover:bg-slate-800 transition-colors text-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502-8.26H3.66l7.73-8.26L2.918 2.25H18.244zM12.001 13.5c-2.485 0-4.5-2.015-4.5-4.5 0-2.485 2.015-4.5 4.5-4.5 2.485 0 4.5 2.015 4.5 4.5 0 2.485-2.015 4.5-4.5 4.5zm0-6c-2.485 0-4.5-2.015-4.5-4.5 0-2.485 2.015-4.5 4.5-4.5 2.485 0 4.5 2.015 4.5 4.5 0 2.485-2.015 4.5-4.5 4.5z"/>
                    </svg>
                    Share on X to unlock 5000 more rows
                  </button>
                  <button
                    onClick={() => setShowUnlockModal(false)}
                    className="w-full border-2 border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Continue with preview
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-xs">
                    Payment email: xingfang.wang@gmail.com
                  </p>
                </div>
              </div>
            </div>
          )}

          {showPaymentModal && result && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-slate-200 rounded-lg p-8 max-w-md w-full shadow-soft-xl">
                <div className="text-center mb-6">
                  <div className="text-indigo-500 text-5xl mb-4">⚡</div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Your data is huge</h2>
                  <p className="text-slate-600 text-sm mb-4">
                    Your file has {result.totalRows.toLocaleString()} rows, which exceeds the free limit of {result.freeLimit.toLocaleString()} rows.
                  </p>
                  <p className="text-slate-500 text-sm mb-6">
                    Only the first {result.freeLimit.toLocaleString()} rows have been processed in preview mode.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
                  <p className="text-center text-slate-900 font-mono text-lg">
                    $5 <span className="text-slate-500 text-sm">per 100k rows</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href="https://paypal.me/xingfangwang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors text-center"
                  >
                    Pay via PayPal
                  </a>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full border border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Continue with preview
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-xs">
                    Payment email: xingfang.wang@gmail.com
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            onClick={isCleaning ? undefined : handleClick}
            onDragOver={isCleaning ? undefined : handleDragOver}
            onDragLeave={isCleaning ? undefined : handleDragLeave}
            onDrop={isCleaning ? undefined : handleDrop}
            className={`
              w-full max-w-2xl mx-auto h-64 md:h-80 lg:h-96
              border-2 border-dashed rounded-lg
              flex flex-col items-center justify-center
              transition-all duration-300
              ${isDragging && !isCleaning
                ? 'border-indigo-500 bg-indigo-50 cursor-pointer' 
                : isCleaning
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50 cursor-pointer'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.jsonl"
              onChange={handleFileChange}
              disabled={isCleaning}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="text-center">
                {isCleaning ? (
                  <>
                    <div className="animate-spin text-indigo-500 text-6xl mb-4">⟳</div>
                    <p className="text-slate-900 text-xl font-medium">Processing...</p>
                  </>
                ) : result ? (
                  <>
                    <div className="text-indigo-500 text-6xl mb-4">✓</div>
                    <p className="text-slate-900 text-xl font-medium">{uploadedFile.name}</p>
                    <p className="text-slate-500 text-sm mt-2">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-4 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                    >
                      Upload another file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-indigo-500 text-6xl mb-4">✓</div>
                    <p className="text-slate-900 text-xl font-medium">{uploadedFile.name}</p>
                    <p className="text-slate-500 text-sm mt-2">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                )}
              </div>
            ) : (
              <>
                <svg
                  className={`w-16 h-16 mb-6 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className={`text-xl md:text-2xl font-medium ${isDragging ? 'text-indigo-500' : 'text-slate-700'}`}>
                  Drop your messy CSV/JSONL here
                </p>
                <p className="text-slate-500 text-sm mt-4">
                  or click to browse
                </p>
              </>
            )}
          </div>

          <div className="mt-20 w-full">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
                <div className="text-indigo-500 text-3xl mb-4">🧹</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Remove Gibberish</h3>
                <p className="text-slate-600 text-sm">
                  Automatically detect and remove rows with corrupted or invalid characters.
                </p>
              </div>
              <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
                <div className="text-indigo-500 text-3xl mb-4">🔄</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Remove Duplicates</h3>
                <p className="text-slate-600 text-sm">
                  Eliminate duplicate rows to ensure clean, unique training data.
                </p>
              </div>
              <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
                <div className="text-indigo-500 text-3xl mb-4">📏</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Filter Short Content</h3>
                <p className="text-slate-600 text-sm">
                  Remove rows with insufficient content to improve data quality.
                </p>
              </div>
              <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
                <div className="text-indigo-500 text-3xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Fix Date Formats</h3>
                <p className="text-slate-600 text-sm">
                  Normalize date formats to YYYY-MM-DD for consistency.
                </p>
              </div>
              <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
                <div className="text-indigo-500 text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                <p className="text-slate-600 text-sm">
                  Process thousands of rows in seconds with pure browser-based processing.
                </p>
              </div>
              <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-soft">
                <div className="text-indigo-500 text-3xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy First</h3>
                <p className="text-slate-600 text-sm">
                  Your data never leaves your browser. 100% client-side processing.
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-20 w-full pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="text-center md:text-left">
                <p className="text-slate-900 text-2xl md:text-3xl font-bold">
                  $5 <span className="text-slate-500 text-lg">per 100k rows</span>
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-slate-500 text-sm mb-2">Pay to:</p>
                <a 
                  href="https://paypal.me/xingfangwang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-indigo-500 font-medium transition-colors"
                >
                  paypal: xingfang.wang@gmail.com
                </a>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-slate-700 text-sm font-medium mb-4 uppercase tracking-wider">
                Related Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-indigo-500 text-sm transition-colors"
                >
                  How to clean CSV for GPT-4 fine-tuning
                </a>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-indigo-500 text-sm transition-colors"
                >
                  Convert Excel to JSONL for AI
                </a>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-indigo-500 text-sm transition-colors"
                >
                  Remove noise from training datasets
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="text-center md:text-left">
                <p className="text-slate-500 text-sm">
                  Support: 457239850@qq.com
                </p>
              </div>
              <div className="text-center md:text-right">
                <a 
                  href="mailto:457239850@qq.com"
                  className="text-slate-600 hover:text-indigo-500 text-sm transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>

            <div className="text-center text-slate-400 text-xs">
              © 2026 CleanCSV.ai | All rights reserved
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
