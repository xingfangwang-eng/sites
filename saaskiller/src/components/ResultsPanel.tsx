"use client";

import { forwardRef, useMemo, useState } from "react";
import { AnalysisResult, MatchedSubscription } from "@/lib/parser";

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

function PayPalModal({ isOpen, onClose, onUnlock }: PayPalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🔓</div>
          <h3 className="text-2xl font-bold text-white mb-2">Unlock Full Report</h3>
          <p className="text-gray-400 mb-6">
            Get access to 500+ direct cancel links and the complete analysis
          </p>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">PayPal Payment</p>
            <p className="text-lg font-mono text-warning-red">xingfang.wang@gmail.com</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onUnlock}
              className="w-full py-3 bg-warning-red hover:bg-warning-red-hover text-white font-bold rounded-lg transition-colors"
            >
              💳 I have paid - Unlock Now
            </button>
            <p className="text-xs text-gray-500">
              After payment, the list will be fully visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnlockOverlay({ onUnlock }: { onUnlock: () => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md" />
        <div className="relative z-20 text-center px-6">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Unlock the full report and 500+ direct cancel links.
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-8 py-4 bg-warning-red hover:bg-warning-red-hover text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-warning-red/25"
          >
            Save $200+ Today for only $4.99
          </button>
          <p className="mt-4 text-sm text-gray-400">
            After payment, the list will be fully visible.
          </p>
        </div>
      </div>

      <PayPalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUnlock={() => {
          setShowModal(false);
          onUnlock();
        }}
      />
    </>
  );
}

function SubscriptionItem({ subscription, isLocked }: { subscription: MatchedSubscription; isLocked: boolean }) {
  const { service, transactions, totalSpent } = subscription;

  return (
    <div className={`flex items-center justify-between py-4 border-b border-gray-800 last:border-0 group hover:bg-gray-900/30 px-4 -mx-4 transition-colors ${isLocked ? 'blur-sm' : ''}`}>
      <div className="flex items-center gap-4">
        <span className="text-2xl">{service.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
          <p className="text-sm text-gray-500">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} · ${totalSpent.toFixed(2)}
          </p>
        </div>
      </div>
      <a
        href={service.cancel_url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 bg-warning-red hover:bg-warning-red-hover text-white font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        KILL THIS
      </a>
    </div>
  );
}

function AnnualWasteDisplay({ amount }: { amount: number }) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="text-center mb-8">
      <p className="text-gray-400 text-lg mb-2">You are wasting</p>
      <p className="text-6xl md:text-7xl font-bold text-warning-red mb-2">
        ${formatNumber(amount)}
      </p>
      <p className="text-gray-400 text-lg">per year</p>
    </div>
  );
}

function DuplicateWarning({ count }: { count: number }) {
  if (count < 2) return null;

  return (
    <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
      <span className="text-2xl">⚠️</span>
      <p className="text-yellow-400 font-semibold">
        Found {count} duplicate subscriptions!
      </p>
    </div>
  );
}

function calculateDuplicates(subscriptions: MatchedSubscription[]): number {
  const serviceCount = new Map<string, number>();
  
  for (const sub of subscriptions) {
    const count = serviceCount.get(sub.service.id) || 0;
    serviceCount.set(sub.service.id, count + 1);
  }
  
  let duplicates = 0;
  serviceCount.forEach((count) => {
    if (count > 1) {
      duplicates += count;
    }
  });
  
  return duplicates;
}

export const ResultsPanel = forwardRef<HTMLDivElement, ResultsPanelProps>(
  function ResultsPanel({ result, isLoading }, ref) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const duplicateCount = useMemo(() => {
      if (!result) return 0;
      return calculateDuplicates(result.subscriptions);
    }, [result]);

    if (isLoading) {
      return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-warning-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl text-gray-400">Analyzing your statement...</p>
            <p className="text-sm text-gray-600 mt-2">
              Scanning for zombie subscriptions
            </p>
          </div>
        </div>
      );
    }

    if (!result) {
      return null;
    }

    if (result.subscriptions.length === 0) {
      return (
        <div ref={ref} className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Zombie Subscriptions Found!
            </h2>
            <p className="text-gray-400">
              Your bank statement looks clean. Keep it up!
            </p>
          </div>
        </div>
      );
    }

    const annualWaste = result.totalWasted * 12;

    return (
      <div ref={ref} className="w-full max-w-4xl mx-auto px-4 py-12">
        <AnnualWasteDisplay amount={annualWaste} />

        <DuplicateWarning count={duplicateCount} />

        <div className="relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">
              💀 Identified SaaS ({result.totalServices})
            </h3>
            <span className="text-sm text-gray-500">
              Total: ${result.totalWasted.toFixed(2)}
            </span>
          </div>

          <div className="divide-y divide-gray-800 relative">
            {result.subscriptions.map((subscription, index) => (
              <SubscriptionItem
                key={`${subscription.service.id}-${index}`}
                subscription={subscription}
                isLocked={!isUnlocked}
              />
            ))}
            
            {!isUnlocked && <UnlockOverlay onUnlock={() => setIsUnlocked(true)} />}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            💡 Click &quot;KILL THIS&quot; to cancel subscriptions you don&apos;t use
          </p>
        </div>
      </div>
    );
  }
);
