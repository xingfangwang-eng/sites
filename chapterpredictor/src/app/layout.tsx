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
  title: "Hunter x Hunter Release Date Predictor",
  description: "Real-time tracking of Togashi's Twitter updates and prediction of Hunter x Hunter chapter release dates",
  keywords: "HxH Release Date, Hunter x Hunter 411, Togashi Twitter Track, Hunter x Hunter chapter prediction",
  openGraph: {
    title: "Hunter x Hunter Release Date Predictor",
    description: "Real-time tracking of Togashi's Twitter updates and prediction of Hunter x Hunter chapter release dates",
    type: "website",
  },
  twitter: {
    title: "Hunter x Hunter Release Date Predictor",
    description: "Real-time tracking of Togashi's Twitter updates and prediction of Hunter x Hunter chapter release dates",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
