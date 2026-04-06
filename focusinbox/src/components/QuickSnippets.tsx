'use client';

import React, { useState, useEffect } from 'react';

interface QuickSnippetsProps {
  onSelectSnippet: (text: string) => void;
}

interface Snippet {
  id: string;
  text: string;
}

export default function QuickSnippets({ onSelectSnippet }: QuickSnippetsProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([
    { id: '1', text: 'Thank you' },
    { id: '2', text: 'Let\'s call' },
    { id: '3', text: 'Interested' },
  ]);
  const [showEdit, setShowEdit] = useState(false);
  const [editSnippets, setEditSnippets] = useState<Snippet[]>([
    { id: '1', text: 'Thank you' },
    { id: '2', text: 'Let\'s call' },
    { id: '3', text: 'Interested' },
  ]);

  // Load custom snippets from localStorage
  useEffect(() => {
    const savedSnippets = localStorage.getItem('quickSnippets');
    if (savedSnippets) {
      try {
        const parsedSnippets = JSON.parse(savedSnippets);
        setSnippets(parsedSnippets);
        setEditSnippets(parsedSnippets);
      } catch (error) {
        console.error('Error parsing saved snippets:', error);
      }
    }
  }, []);

  // Save snippets to localStorage
  const saveSnippets = (newSnippets: Snippet[]) => {
    localStorage.setItem('quickSnippets', JSON.stringify(newSnippets));
    setSnippets(newSnippets);
  };

  // Handle edit save
  const handleSaveEdit = () => {
    saveSnippets(editSnippets);
    setShowEdit(false);
  };

  // Handle snippet input change
  const handleSnippetChange = (id: string, text: string) => {
    setEditSnippets(prev => 
      prev.map(snippet => snippet.id === id ? { ...snippet, text } : snippet)
    );
  };

  if (showEdit) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Edit Quick Snippets</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowEdit(false)}
              className="px-3 py-1 border border-white/20 rounded hover:bg-white/5 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 border border-white/20 rounded hover:bg-white/5 transition-colors text-xs"
            >
              Save
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {editSnippets.map((snippet) => (
            <input
              key={snippet.id}
              type="text"
              value={snippet.text}
              onChange={(e) => handleSnippetChange(snippet.id, e.target.value)}
              className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Quick Snippets</h3>
        <button
          onClick={() => setShowEdit(true)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Edit Snippets
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {snippets.map((snippet) => (
          <button
            key={snippet.id}
            onClick={() => onSelectSnippet(snippet.text)}
            className="px-4 py-1 bg-white text-black rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            {snippet.text}
          </button>
        ))}
      </div>
    </div>
  );
}
