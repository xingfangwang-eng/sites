import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import ErrorBoundary from "./ErrorBoundary";

export const metadata: Metadata = {
  title: "PingThem.io | The Simplest Gmail Follow-up Tool for Sales",
  description: "Stop losing deals in your messy CRM. PingThem.io identifies ghosted emails and lets you follow up in one click. No complexity, just closings.",
  keywords: ["Gmail follow up automation", "Sales productivity tool", "Alternative to HubSpot", "email follow up", "sales tool", "CRM alternative"],
  openGraph: {
    title: "PingThem.io | The Simplest Gmail Follow-up Tool for Sales",
    description: "Stop losing deals in your messy CRM. PingThem.io identifies ghosted emails and lets you follow up in one click. No complexity, just closings.",
    images: [{
      url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20modern%20SaaS%20landing%20page%20with%20indigo%20accent%20for%20email%20follow%20up%20tool&image_size=square_hd",
      width: 1200,
      height: 630,
      alt: "PingThem.io - Gmail Follow-up Tool",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PingThem.io | The Simplest Gmail Follow-up Tool for Sales",
    description: "Stop losing deals in your messy CRM. PingThem.io identifies ghosted emails and lets you follow up in one click. No complexity, just closings.",
    images: ["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20modern%20SaaS%20landing%20page%20with%20indigo%20accent%20for%20email%20follow%20up%20tool&image_size=square_hd"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      <body className="antialiased">
        <ErrorBoundary>
          <SessionProviderWrapper>
            {children}
          </SessionProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
