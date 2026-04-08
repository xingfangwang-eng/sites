'use client';
import React, { useState, useRef, useEffect } from 'react';

interface GameContainerProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
}

export default function GameContainer({ isOpen, onClose, gameUrl }: GameContainerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ action: 'mute', value: !isMuted }, '*');
    }
  };

  const handleDimToggle = () => {
    setIsDimmed(!isDimmed);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Game Container</h2>
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded hover:bg-gray-100 ${
                isMuted ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-100 ${
                isDimmed ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={handleDimToggle}
              title={isDimmed ? 'Brighten' : 'Dim'}
            >
              {isDimmed ? '💡' : '🌙'}
            </button>
            <button
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              onClick={onClose}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
        <div className={`flex-1 relative ${
          isDimmed ? 'filter brightness-75' : ''
        }`}>
          <iframe
            ref={iframeRef}
            src={`/api/proxy?url=${encodeURIComponent(gameUrl)}`}
            className="w-full h-full border-0"
            title="Game"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
