import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BaseLayout from './components/BaseLayout';
import { getTenantFromHost, getDefaultTenant } from '../lib/tenant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wang Dadi Multi-tenant App',
  description: 'Multi-tenant architecture demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const tenant = getTenantFromHost(host) || getDefaultTenant();

  return (
    <html lang="en" data-tenant={tenant.id}>
      <body className={inter.className}>
        <BaseLayout tenant={tenant}>
          {children}
        </BaseLayout>
      </body>
    </html>
  );
}
