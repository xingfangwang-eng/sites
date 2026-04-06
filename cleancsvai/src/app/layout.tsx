import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'CleanCSV.ai | Fast CSV Data Cleaning for LLM Fine-tuning',
  description: 'The fastest way to clean, de-bloat, and convert messy CSV data for AI training. One-click formatting for OpenAI, Anthropic, and Llama fine-tuning. No Python scripts required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
