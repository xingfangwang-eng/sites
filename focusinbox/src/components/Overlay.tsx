'use client';

import React from 'react';

interface OverlayProps {
  onClose: () => void;
}

export default function Overlay({ onClose }: OverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md border border-white/10 text-center">
        <h3 className="text-xl font-medium mb-4">Focus on work, focus on conversion</h3>
        <p className="text-sm text-gray-400 mb-6">
          Upgrade to Pro version for complete distraction-free experience and improved productivity.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
        >
          I understand
        </button>
      </div>
    </div>
  );
}