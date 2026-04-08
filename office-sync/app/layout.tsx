import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financial Tracker",
  description: "A financial tracking application",
  manifest: "/manifest.json",
  themeColor: "#0078d4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/icons/icon-512x512.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Financial Tracker" />
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="uTT2vLHXrvh44esSpln_EMc1QEFjkN0vjJZ04UgI0Qc" />
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {
            `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // 动态注入项目名
            gtag('config', 'G-WC4677QJMF', {
              page_path: window.location.pathname,
            });
            `
          }
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
