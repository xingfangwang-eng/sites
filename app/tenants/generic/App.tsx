'use client';

import React from 'react';
import { TenantConfig } from '../../../lib/tenant';

interface GenericAppProps {
  tenant: TenantConfig;
}

export default function GenericApp({ tenant }: GenericAppProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
          {tenant.name}
        </h2>
        <p className="text-gray-600 mb-6">
          Welcome to {tenant.name} - part of the Wang Dadi multi-tenant architecture.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Site ID:</span>
              <span className="font-medium">{tenant.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Domain:</span>
              <span className="font-medium">{tenant.domain}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Primary Color:</span>
              <span className="font-medium" style={{ color: tenant.theme.primaryColor }}>
                {tenant.theme.primaryColor}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Secondary Color:</span>
              <span className="font-medium" style={{ color: tenant.theme.secondaryColor }}>
                {tenant.theme.secondaryColor}
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-2xl font-semibold mb-4">Features</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={tenant.features.payment} 
                disabled 
                className="mr-2"
              />
              <label>Payment Integration</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={tenant.features.analytics} 
                disabled 
                className="mr-2"
              />
              <label>Analytics</label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
