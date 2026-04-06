import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaSStripper - Strip Bloated APIs into Clean Data",
  description: "Tired of expensive, bloated SaaS APIs? SaaSStripper.io turns complex API responses into clean data for $9/mo.",
  keywords: "Low-cost API wrapper, Tiny SaaS tools for founders, JSON simplifier for developers, Affordable API integration tool, Solo founder productivity hacks",
  authors: [{ name: "SaaSStripper" }],
  openGraph: {
    title: "SaaSStripper - Strip Bloated APIs into Clean Data",
    description: "Tired of expensive, bloated SaaS APIs? SaaSStripper.io turns complex API responses into clean data for $9/mo.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SaaSStripper",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "9",
    "priceCurrency": "USD"
  },
  "description": "Tired of expensive, bloated SaaS APIs? SaaSStripper.io turns complex API responses into clean data for $9/mo.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  }
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
    'project_name': 'saasstripper'
  });
</script>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
