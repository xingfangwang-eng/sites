import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NavSlayer - The $0.50 LinkedIn Sales Navigator Alternative | B2B Lead Generation Tool",
  description: "Why pay $99 for Sales Navigator? NavSlayer.com gives you direct decision-maker emails for $0.50. High-converting B2B lead generation made simple. The affordable Sales Navigator alternative for smart sales teams.",
  keywords: "Lead Generation, Sales Navigator Alternative, B2B Lead Generation, LinkedIn Lead Generation, Find CEO Email, Cheap Lead Generation Tool",
  robots: "index, follow",
  openGraph: {
    title: "NavSlayer - The $0.50 LinkedIn Sales Navigator Alternative",
    description: "Get direct decision-maker emails for $0.50. High-converting B2B lead generation made simple.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NavSlayer - The $0.50 LinkedIn Sales Navigator Alternative",
    description: "Get direct decision-maker emails for $0.50. High-converting B2B lead generation made simple.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // 动态注入项目名
  gtag('config', 'G-WC4677QJMF', {
    'project_name': 'src'
  });
</script>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="dns-prefetch" href="https://api.apollo.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
