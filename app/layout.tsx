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
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // 动态注入项目名
  gtag('config', 'G-WC4677QJMF', {
    'project_name': 'multi-tenant-demo'
  });
</script>
      <body className={inter.className}>
        <BaseLayout tenant={tenant}>
          {children}
        </BaseLayout>
      </body>
    </html>
  );
}
