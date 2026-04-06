export const metadata = {
  title: "NoAI.md",
  description: "The only editor that doesn't spy on your thoughts with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="uMhxBblZgqbKzi14RficZNKz9a1kVIIBKkMnvNC4j_A" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WC4677QJMF', {
              'project_name': 'noaimd'
            });
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
