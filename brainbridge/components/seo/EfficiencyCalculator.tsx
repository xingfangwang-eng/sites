'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Zap } from 'lucide-react';

interface EfficiencyCalculatorProps {
  category: string;
}

const categoryTitles = {
  Developer: ['Developer Productivity Leak', 'Code Context Switching Cost', 'Developer Time Drain'],
  Writer: ['Writer Focus Disruption', 'Content Creation Efficiency Drop', 'Writer Productivity Gap'],
  Researcher: ['Researcher Time Drain', 'Academic Context Loss', 'Research Efficiency Leak'],
  Student: ['Student Study Time Waste', 'Learning Context Disruption', 'Student Productivity Gap']
};

export function EfficiencyCalculator({ category }: EfficiencyCalculatorProps) {
  const [swaps, setSwaps] = useState(20);
  const [cleanupTime, setCleanupTime] = useState(45);
  const [title, setTitle] = useState('');
  
  // Set random title based on category
  useEffect(() => {
    const titles = categoryTitles[category as keyof typeof categoryTitles] || categoryTitles.Developer;
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    setTitle(randomTitle);
  }, [category]);
  
  // Calculate time wasted and financial loss
  const calculateWaste = () => {
    const annualTimeWasted = (swaps * cleanupTime * 250) / 3600;
    const financialLoss = annualTimeWasted * 50;
    return { annualTimeWasted, financialLoss };
  };
  
  const { annualTimeWasted, financialLoss } = calculateWaste();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200 p-8 rounded-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        {title}
      </h2>
      
      <div className="space-y-8">
        {/* Daily AI Context Swaps Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-slate-700">Daily AI Context Swaps</label>
            <span className="text-lg font-bold text-red-600">{swaps}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={swaps}
            onChange={(e) => setSwaps(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Cleanup Time per Paste Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-slate-700">Cleanup Time per Paste (seconds)</label>
            <span className="text-lg font-bold text-red-600">{cleanupTime}s</span>
          </div>
          <input
            type="range"
            min="15"
            max="120"
            value={cleanupTime}
            onChange={(e) => setCleanupTime(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>15s</span>
            <span>67s</span>
            <span>120s</span>
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-slate-900">Time Waste Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-2xl font-bold text-slate-900 mb-2">
                You are losing {annualTimeWasted.toFixed(1)} hours per year to AI Tab-Hopping.
              </p>
              <p className="text-xl text-slate-600">
                That's ${financialLoss.toFixed(2)} in lost productivity.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md text-center">
              <p className="text-xl font-bold text-red-600 mb-4">
                Save this time with a one-time payment of $6.9.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition-colors active:scale-95"
              >
                Get BrainBridge Now
                <Zap className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
