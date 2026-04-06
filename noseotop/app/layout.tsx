import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoSEO.top',
  description: 'A Micro-SaaS for SEO analysis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // 动态注入项目名
            gtag('config', 'G-WC4677QJMF', {
              'project_name': 'noseotop'
            });
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}