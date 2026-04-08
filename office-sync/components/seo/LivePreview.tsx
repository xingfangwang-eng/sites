'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, FileSpreadsheet, Code } from 'lucide-react';

export default function LivePreview() {
  const [mode, setMode] = useState<'game' | 'excel' | 'vscode'>('game');

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-md mb-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center border-l-4 border-blue-500 pl-4">
        <Gamepad2 className="w-5 h-5 text-slate-400 mr-2" />
        Live Preview: See the Magic
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Window */}
        <div className="relative bg-slate-900 rounded-lg overflow-hidden shadow-xl" style={{ height: '400px' }}>
          {/* Window Controls */}
          <div className="bg-slate-800 px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-slate-400">
              {mode === 'game' && 'Game Window'}
              {mode === 'excel' && 'Microsoft Excel - Financial_Report.xlsx'}
              {mode === 'vscode' && 'Visual Studio Code - project.ts'}
            </span>
          </div>
          
          {/* Content Area */}
          <div className="relative h-full">
            <AnimatePresence mode="wait">
              {mode === 'game' && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"
                >
                  {/* Simulated Game Screen */}
                  <div className="text-center">
                    <div className="mb-4">
                      <Gamepad2 className="w-24 h-24 text-white mx-auto animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Your Favorite Game</h3>
                    <p className="text-slate-300">Running in stealth mode</p>
                    <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">60</div>
                        <div className="text-sm text-slate-300">FPS</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">4K</div>
                        <div className="text-sm text-slate-300">Quality</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">0</div>
                        <div className="text-sm text-slate-300">Lag</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {mode === 'excel' && (
                <motion.div
                  key="excel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white"
                >
                  {/* Excel Interface */}
                  <div className="bg-slate-100 border-b border-slate-300 px-4 py-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-medium text-slate-700">File</span>
                      <span className="font-medium text-slate-700">Home</span>
                      <span className="font-medium text-slate-700">Insert</span>
                      <span className="font-medium text-slate-700">Data</span>
                      <span className="font-medium text-slate-700">Review</span>
                    </div>
                  </div>
                  
                  {/* Toolbar */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center space-x-2">
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <span className="text-sm text-slate-600">Calibri</span>
                    <span className="text-sm text-slate-600">11</span>
                  </div>
                  
                  {/* Spreadsheet Grid */}
                  <div className="p-4">
                    <div className="grid gap-px bg-slate-200" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white p-2 text-xs text-slate-700 border border-slate-200"
                          style={{ height: '24px' }}
                        >
                          {i % 8 === 0 && Math.floor(i / 8) + 1}
                          {i % 8 !== 0 && i % 8 === 1 && ['Revenue', 'Q1', 'Q2', 'Q3', 'Q4', 'Total', 'Growth'][Math.floor(i / 8)]}
                          {i % 8 !== 0 && i % 8 !== 1 && Math.floor(i / 8) > 0 && Math.floor(i / 8) < 6 && `$${(Math.random() * 10000).toFixed(0)}`}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {mode === 'vscode' && (
                <motion.div
                  key="vscode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-slate-900"
                >
                  {/* VS Code Interface */}
                  <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-12 bg-slate-800 flex flex-col items-center py-2 space-y-4">
                      <Code className="w-6 h-6 text-slate-400" />
                      <div className="w-6 h-6 bg-slate-700 rounded"></div>
                      <div className="w-6 h-6 bg-slate-700 rounded"></div>
                      <div className="w-6 h-6 bg-slate-700 rounded"></div>
                    </div>
                    
                    {/* File Explorer */}
                    <div className="w-48 bg-slate-800 border-r border-slate-700 p-2">
                      <div className="text-xs text-slate-400 mb-2">EXPLORER</div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-300 flex items-center">
                          <span className="mr-1">📁</span> src
                        </div>
                        <div className="text-xs text-slate-300 flex items-center ml-3">
                          <span className="mr-1">📄</span> index.ts
                        </div>
                        <div className="text-xs text-slate-300 flex items-center ml-3">
                          <span className="mr-1">📄</span> utils.ts
                        </div>
                        <div className="text-xs text-slate-300 flex items-center">
                          <span className="mr-1">📁</span> components
                        </div>
                      </div>
                    </div>
                    
                    {/* Code Editor */}
                    <div className="flex-1 bg-slate-900 p-4 font-mono text-sm">
                      <div className="flex space-x-2 mb-2 border-b border-slate-700 pb-2">
                        <div className="px-3 py-1 bg-slate-800 text-slate-300 rounded-t text-xs">index.ts</div>
                      </div>
                      <div className="space-y-1">
                        <div><span className="text-purple-400">import</span> <span className="text-slate-300">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
                        <div></div>
                        <div><span className="text-purple-400">export default function</span> <span className="text-yellow-300">App</span>() {'{'}</div>
                        <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                        <div className="pl-8"><span className="text-slate-300">&lt;div&gt;</span></div>
                        <div className="pl-12"><span className="text-slate-300">&lt;h1&gt;</span><span className="text-slate-300">Hello World</span><span className="text-slate-300">&lt;/h1&gt;</span></div>
                        <div className="pl-8"><span className="text-slate-300">&lt;/div&gt;</span></div>
                        <div className="pl-4">);</div>
                        <div>{'}'}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Switch Between Modes</h3>
          <p className="text-slate-600 mb-6">
            Click the buttons below to see how StealthPlay instantly disguises your gaming session as productive work applications.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => setMode('game')}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-md font-bold transition-all ${
                mode === 'game'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Gaming Mode
            </button>
            
            <button
              onClick={() => setMode('excel')}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-md font-bold transition-all ${
                mode === 'excel'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Work Mode (Excel)
            </button>
            
            <button
              onClick={() => setMode('vscode')}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-md font-bold transition-all ${
                mode === 'vscode'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Code className="w-5 h-5 mr-2" />
              Dev Mode (VS Code)
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900">
              <span className="font-bold">💡 Pro Tip:</span> Your IT admin will only see a standard productive application. The transition happens in under 100ms!
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Text */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 text-lg">
          Your IT admin will only see a standard productive application.
        </p>
      </div>
    </div>
  );
}
