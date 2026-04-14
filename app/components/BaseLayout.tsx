import React from 'react';
import { TenantConfig } from '../../lib/tenant';

interface BaseLayoutProps {
  tenant: TenantConfig;
  children: React.ReactNode;
}

export default function BaseLayout({ tenant, children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer style={{ 
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '2rem 0',
        marginTop: '3rem'
      }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Support: <a href="mailto:457239850@qq.com" style={{ color: '#4f46e5', textDecoration: 'none' }}>457239850@qq.com</a>
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              © 2026 {tenant.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
