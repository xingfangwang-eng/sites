import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PersonaLock - 锁住你的创作灵魂",
  description: "提取你的创作风格 DNA，让 AI 说话像你",
  metadataBase: new URL("https://personalock.io"),
  openGraph: {
    title: "PersonaLock - 锁住你的创作灵魂",
    description: "提取你的创作风格 DNA，让 AI 说话像你",
    url: "https://personalock.io",
    type: "website",
  },
  twitter: {
    title: "PersonaLock - 锁住你的创作灵魂",
    description: "提取你的创作风格 DNA，让 AI 说话像你",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
