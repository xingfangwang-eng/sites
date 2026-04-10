import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI-Ops Revenue Whip",
  description: "A clean, minimalist dashboard for AI-Ops revenue management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ClientProviders>
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
