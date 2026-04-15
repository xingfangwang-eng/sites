'use client';

import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../../../lib/tenant';
import { TenantStorage } from '../../../lib/storage';

interface CoachellaViralAppProps {
  tenant: TenantConfig;
}

export default function CoachellaViralApp({ tenant }: CoachellaViralAppProps) {
  const storage = new TenantStorage(tenant.id);
  const [paid, setPaid] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [fanBaseSize, setFanBaseSize] = useState(0);
  const [energyScore, setEnergyScore] = useState(5);
  const [viralIndex, setViralIndex] = useState<number | null>(null);
  const [rating, setRating] = useState('');
  
  useEffect(() => {
    const hasPaid = storage.get('paid');
    setPaid(hasPaid || false);
  }, []);
  
  const handlePaymentSuccess = () => {
    setPaid(true);
    storage.set('paid', true);
    setShowPayPal(false);
  };
  
  const calculateViralIndex = () => {
    if (!paid) {
      setShowPayPal(true);
      return;
    }
    
    const V = fanBaseSize * energyScore * 100;
    setViralIndex(V);
    
    if (V >= 1000000) {
      setRating('Viral Sensation');
    } else if (V >= 100000) {
      setRating('Trending');
    } else {
      setRating('Upcoming');
    }
  };
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
          Coachella Viral Calculator
        </h2>
        <p className="text-gray-600 mb-6">
          Calculate your artist's viral potential for Coachella 2026.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Artist Name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter artist name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fan Base Size
              </label>
              <input
                type="number"
                value={fanBaseSize}
                onChange={(e) => setFanBaseSize(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter fan base size"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Energy Score
                </label>
                <span className="text-sm font-medium" style={{ color: tenant.theme.primaryColor }}>
                  {energyScore}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyScore}
                onChange={(e) => setEnergyScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tenant.theme.primaryColor }}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={calculateViralIndex}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
              style={{
                background: `linear-gradient(90deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Calculate Viral Potential
            </button>
          </div>
        </div>
      </section>
      
      {viralIndex !== null && (
        <section>
          <h3 className="text-2xl font-semibold mb-4">Viral Index Results</h3>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Artist:</span>
                <span className="text-lg font-medium">{artistName || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Viral Index:</span>
                <span className="text-2xl font-bold" style={{ color: tenant.theme.primaryColor }}>
                  {viralIndex.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating:</span>
                <span className="text-lg font-medium" style={{ color: tenant.theme.secondaryColor }}>
                  {rating}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {showPayPal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: tenant.theme.primaryColor }}>
              Unlock Premium Features
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Pay $1.99 to access all calculations and predictions
            </p>
            <div className="flex justify-center mb-6">
              <button
                onClick={handlePaymentSuccess}
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300"
                style={{
                  background: `linear-gradient(90deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Pay with PayPal
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowPayPal(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
