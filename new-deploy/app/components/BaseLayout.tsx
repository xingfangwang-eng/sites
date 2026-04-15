import React from 'react';
import { TenantConfig } from '../../lib/tenant';

interface BaseLayoutProps {
  tenant: TenantConfig;
  children: React.ReactNode;
}

export default function BaseLayout({ tenant, children }: BaseLayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}
