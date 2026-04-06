import { Metadata } from 'next'
import Link from 'next/link'
import keywordsData from '@data/keywords.json'
import BaseSEOLayout, { generateSEOMetadata, SEOData } from '@/components/BaseSEOLayout'

if (!Array.isArray(keywordsData)) {
  throw new Error('keywordsData must be an array')
}

function getRandomRelatedPages(currentSlug: string, count: number = 5) {
  const otherKeywords = keywordsData.filter(k => k.slug !== currentSlug)
  const shuffled = otherKeywords.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const keyword = keywordsData.find(k => k.slug === params.slug)
  
  if (!keyword) {
    return {
      title: 'Not Found - NoAIMD',
      description: 'Page not found. NoAIMD - The only editor that doesn\'t spy on your thoughts with AI.',
      keywords: 'markdown editor, ai-free, private, fast, noaimd'
    }
  }

  return generateSEOMetadata(keyword as SEOData, 'NoAIMD', 'https://noaimd.vercel.app')
}

export async function generateStaticParams() {
  return keywordsData.map((keyword) => ({
    slug: keyword.slug
  }))
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const keyword = keywordsData.find(k => k.slug === params.slug)

  if (!keyword) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-4xl mb-4 font-black tracking-tighter text-slate-900">404</h1>
          <p className="text-xl text-slate-600">Page not found</p>
          <Link href="/" className="mt-8 inline-block border border-slate-200 px-6 py-3 hover:bg-slate-100 transition-colors text-slate-900 font-bold">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const relatedPages = getRandomRelatedPages(params.slug, 5)

  return (
    <BaseSEOLayout
      data={keyword as SEOData}
      relatedPages={relatedPages as SEOData[]}
      siteName="NoAIMD"
      brandColor="#3b82f6"
      mainToolUrl="https://noaimd.vercel.app"
      seoData={keywordsData as SEOData[]}
      siteConfig={{
        siteName: "NoAIMD",
        siteUrl: "https://noaimd.vercel.app",
        ctaText: "START WRITING NOW",
        ctaUrl: "/",
        benefits: [
          {
            title: "Zero Latency",
            description: "Opens in under 100ms. No AI bloat slowing you down."
          },
          {
            title: "100% Private",
            description: "Your data never leaves your device. No cloud, no tracking."
          }
        ]
      }}
    >
      {/* 自定义内容 */}
      <div style={{ backgroundColor: '#f0fdf4', padding: '24px', marginBottom: '24px', borderLeft: '4px solid #22c55e' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Why Choose NoAIMD?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#22c55e' }}>🔒 Privacy First</h3>
            <p style={{ fontSize: '14px' }}>Your data never leaves your device. No cloud, no tracking, no AI indexing.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#22c55e' }}>⚡ Lightning Fast</h3>
            <p style={{ fontSize: '14px' }}>Opens in under 100ms. Zero latency typing experience.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#22c55e' }}>💾 Local Processing</h3>
            <p style={{ fontSize: '14px' }}>100% offline capable. Works without internet connection.</p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>The Problem</h2>
        <p style={{ marginBottom: '16px' }}>
          {keyword.problem_description}
        </p>
        <p>
          In today's digital landscape, it feels like every software company is rushing to integrate AI into their products, regardless of whether it actually adds value.
        </p>
      </div>

      <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>The NoAIMD Solution</h2>
        <p style={{ marginBottom: '16px' }}>
          {keyword.how_to_solve}
        </p>
        <p>
          NoAIMD was built with a simple philosophy: focus on what matters. We believe that a markdown editor should be fast, reliable, and respect your privacy.
        </p>
      </div>

      {/* 技术规格 */}
      <div style={{ backgroundColor: '#fef3c7', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Technical Specifications</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div><strong>Startup Time:</strong> &lt;100ms</div>
          <div><strong>Memory Usage:</strong> &lt;5MB RAM</div>
          <div><strong>CPU Usage:</strong> &lt;1% idle</div>
          <div><strong>Bundle Size:</strong> 87KB gzipped</div>
          <div><strong>Offline Capable:</strong> Yes</div>
          <div><strong>Data Encryption:</strong> AES-256 (local)</div>
          <div><strong>API Calls:</strong> 0 (100% offline)</div>
          <div><strong>Tracking Scripts:</strong> 0</div>
          <div><strong>Cloud Dependencies:</strong> None</div>
          <div><strong>Browser Support:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</div>
          <div><strong>Markdown Compliance:</strong> 100% GFM compatible</div>
          <div><strong>Export Formats:</strong> MD, HTML, PDF, TXT</div>
        </div>
      </div>

      {/* 产品功能列表 */}
      <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Key Features</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Zero latency - opens in under 100ms</li>
          <li style={{ marginBottom: '8px' }}>100% private - your data never leaves your device</li>
          <li style={{ marginBottom: '8px' }}>No AI bloat - no unnecessary background processes</li>
          <li style={{ marginBottom: '8px' }}>Simple, clean interface - focus on your writing</li>
          <li style={{ marginBottom: '8px' }}>Markdown support - full compatibility with standard Markdown syntax</li>
          <li style={{ marginBottom: '8px' }}>Export options - save your work in multiple formats</li>
        </ul>
      </div>

      {/* Microsoft Clarity */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
          `
        }}
      />
    </BaseSEOLayout>
  )
}
