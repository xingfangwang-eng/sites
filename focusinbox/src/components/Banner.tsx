'use client';

import React, { useState } from 'react';

interface BannerProps {
  onOverlayShow: () => void;
}

export default function Banner({ onOverlayShow }: BannerProps) {
  const [showPayPalModal, setShowPayPalModal] = useState(false);

  return (
    <>
      {/* 黄色横条 Banner */}
      <div className="bg-yellow-400 text-black py-2 px-4 flex items-center justify-between">
        <p className="font-medium">Focus Mode: 3 Days Left in Trial. Get Pro to keep the noise out.</p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowPayPalModal(true);
          }}
          className="text-black font-medium underline hover:no-underline"
        >
          Upgrade for $9/mo
        </a>
      </div>

      {/* PayPal 支付说明模态框 */}
      {showPayPalModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Upgrade to Pro</h2>
              <button
                onClick={() => setShowPayPalModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm">Thank you for choosing FocusInbox Pro!</p>
              <p className="text-sm">Please send $9/month to the following PayPal address:</p>
              <div className="bg-black p-3 rounded border border-white/10">
                <p className="font-mono text-sm">xingfang.wang@gmail.com</p>
              </div>
              <p className="text-sm text-gray-400">
                After payment, your Pro features will be activated immediately.
              </p>
              <button
                onClick={() => setShowPayPalModal(false)}
                className="w-full px-4 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}