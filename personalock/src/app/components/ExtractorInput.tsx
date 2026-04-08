'use client';
import React, { useState } from 'react';

interface ExtractorInputProps {
  rounded?: string;
  spacing?: string;
  buttonText?: string;
  className?: string;
}

export default function ExtractorInput({ 
  rounded = 'rounded-md', 
  spacing = 'p-6', 
  buttonText = 'Generate Solution',
  className = ''
}: ExtractorInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加提交逻辑
    console.log('Submitted:', inputValue);
  };

  return (
    <div className={`bg-slate-50 border border-slate-200 ${spacing} ${rounded} ${className}`}>
      <div className="mb-4">
        <label className="block text-slate-700 font-medium mb-2">
          OneClickAPI Input
        </label>
        <textarea
          className={`w-full p-4 border border-slate-300 ${rounded} focus:outline-none focus:ring-2 focus:ring-red-600`}
          rows={6}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your code or command here"
        />
      </div>
      <button 
        className={`bg-red-600 text-white px-6 py-3 font-medium hover:bg-red-700 transition-colors active:scale-95 ${rounded}`}
        onClick={handleSubmit}
      >
        {buttonText}
      </button>
    </div>
  );
}
