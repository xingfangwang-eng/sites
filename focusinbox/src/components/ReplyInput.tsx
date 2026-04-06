'use client';

import React, { useState } from 'react';
import QuickSnippets from './QuickSnippets';

interface ReplyInputProps {
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function ReplyInput({
  onClose,
  onSend,
}: ReplyInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      onClose();
    }
  };

  const handleSelectSnippet = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="mt-4 p-4 border border-white/20 rounded bg-black">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Reply</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      {/* Quick reply buttons */}
      <QuickSnippets onSelectSnippet={handleSelectSnippet} />
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your reply..."
          className="w-full bg-black border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white/30 resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className="px-4 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
