"use client";

import { useEffect } from "react";

interface CTAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CTAModal({ isOpen, onClose }: CTAModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Stop Wasting Time on Bloated Data
          </h2>
          <p className="text-slate-500 mb-8">
            Join thousands of developers who have simplified their API workflows. Subscribe now and get unlimited access.
          </p>

          <a
            href="https://www.paypal.com/paypalme/xingfangwang/9USD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
          >
            <span>Subscribe Now - $9</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <p className="text-xs text-slate-400 text-center mt-4">
            One-time payment. No subscription required.
          </p>
        </div>
      </div>
    </div>
  );
}
