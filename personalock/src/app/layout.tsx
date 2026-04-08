import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaLock - Lock Your Creative Soul",
  description: "Extract your creative style DNA, make AI speak like you",
  metadataBase: new URL("https://personalock.wangdadi.xyz"),
  openGraph: {
    title: "PersonaLock - Lock Your Creative Soul",
    description: "Extract your creative style DNA, make AI speak like you",
    url: "https://personalock.wangdadi.xyz",
    type: "website",
  },
  twitter: {
    title: "PersonaLock - Lock Your Creative Soul",
    description: "Extract your creative style DNA, make AI speak like you",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
       <meta name="google-site-verification" content="uTT2vLHXrvh44esSpln_EMc1QEFjkN0vjJZ04UgI0Qc" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {
            `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WC4677QJMF', {
              'project_name': 'src'
            });
          `
          }
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
