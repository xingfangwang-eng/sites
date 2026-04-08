'use client';
import React, { useState, useEffect } from 'react';

interface PersonaDilutionCalculatorProps {
  className?: string;
}

const AICOMMONWORDS = [
  'delve', 'unlock', 'tapestry', 'comprehensive', 'leverage', 'synergy', 'catalyze',
  'empower', 'transform', 'optimize', 'enhance', 'elevate', 'streamline', 'revolutionize',
  'innovate', 'disrupt', 'scale', 'accelerate', 'maximize', 'minimize', 'firstly', 'secondly',
  'thirdly', 'finally', 'in conclusion', 'therefore', 'thus', 'hence', 'consequently'
];

export default function PersonaDilutionCalculator({ className = '' }: PersonaDilutionCalculatorProps) {
  const [text, setText] = useState('');
  const [aiIndex, setAiIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateAiIndex = (inputText: string) => {
    if (!inputText) return 0;
    
    const words = inputText.toLowerCase().split(/\s+/);
    const aiWordCount = words.filter(word => AICOMMONWORDS.includes(word)).length;
    const totalWords = words.length;
    const index = totalWords > 0 ? Math.min(Math.round((aiWordCount / totalWords) * 100), 100) : 0;
    
    return index;
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // 模拟计算过程
    setTimeout(() => {
      const index = calculateAiIndex(text);
      setAiIndex(index);
      setDisplayIndex(0);
      
      // 数字滚动动画
      const interval = setInterval(() => {
        setDisplayIndex(prev => {
          if (prev >= index) {
            clearInterval(interval);
            setIsCalculating(false);
            return index;
          }
          return prev + 1;
        });
      }, 20);
    }, 500);
  };

  const getScoreMessage = (index: number) => {
    if (index < 20) return 'Excellent! Your text has minimal AI scent.';
    if (index < 40) return 'Good! Your text has low AI scent.';
    if (index < 60) return 'Moderate. Your text has some AI scent.';
    if (index < 80) return 'High. Your text has significant AI scent.';
    return 'Very High. Your text has strong AI scent.';
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-8 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Persona Dilution Calculator</h2>
      
      <div className="mb-6">
        <label htmlFor="text-input" className="block text-slate-700 mb-2">Paste your text here:</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your AI-generated content here to check its AI scent..."
          className="w-full border border-slate-300 p-4 rounded-lg h-48 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <button
        onClick={handleCalculate}
        disabled={isCalculating || !text.trim()}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        {isCalculating ? 'Analyzing...' : 'Calculate AI Scent Index'}
      </button>
      
      {aiIndex > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-700 font-medium">AI Scent Index:</span>
            <span className="text-2xl font-bold text-purple-600">{displayIndex}%</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-700 h-full transition-all duration-1000 ease-out"
              style={{ width: `${displayIndex}%` }}
            ></div>
          </div>
          
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-bold text-purple-800 mb-2">Analysis Result</h3>
            <p className="text-purple-700 mb-4">{getScoreMessage(aiIndex)}</p>
            <p className="text-purple-700 font-medium">
              Using PersonaLock to extract your Style DNA can reduce AI scent by up to 80%!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
