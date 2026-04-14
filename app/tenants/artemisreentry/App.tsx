import React from 'react';
import { TenantConfig } from '@/lib/tenant';

interface ArtemisReentryAppProps {
  tenant: TenantConfig;
}

export default function ArtemisReentryApp({ tenant }: ArtemisReentryAppProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
          Artemis Reentry Simulator
        </h2>
        <p className="text-gray-600 mb-6">
          Simulate space capsule reentry with real-time physics calculations.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Reentry Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Angle (degrees)
              </label>
              <input
                type="range"
                min="1"
                max="15"
                defaultValue="4"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tenant.theme.primaryColor }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Velocity (km/s)
              </label>
              <input
                type="range"
                min="7"
                max="11"
                defaultValue="7.8"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tenant.theme.primaryColor }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capsule Mass (kg)
              </label>
              <input
                type="number"
                defaultValue="2500"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
              style={{
                background: `linear-gradient(90deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Start Simulation
            </button>
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-2xl font-semibold mb-4">Simulation Results</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Max Temperature</p>
              <p className="text-2xl font-bold">1,200°C</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Deceleration</p>
              <p className="text-2xl font-bold">8.5 g</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Landing Accuracy</p>
              <p className="text-2xl font-bold">98.7%</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
