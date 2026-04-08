import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Never Explain - AI Workflow Optimization",
  description: "Optimize your AI workflow with context management and recall hooks",
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
        {/* Google Search Console 验证标签 */}
        <meta name="google-site-verification" content="uTT2vLHXrvh44esSpln_EMc1QEFjkN0vjJZ04UgI0Qc" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
        <script async dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // 动态注入项目名
            gtag('config', 'G-WC4677QJMF', {
              'project_name': 'never-explain-web'
            });
          `
        }}></script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
