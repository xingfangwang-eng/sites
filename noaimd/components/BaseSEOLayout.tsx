import { Metadata } from 'next'
import Link from 'next/link'

// 标准化的 SEO 数据接口
export interface SEOData {
  keyword: string
  slug: string
  title: string
  problem_description: string
  how_to_solve: string
}

// 站点配置接口
export interface SiteConfig {
  siteName: string
  siteUrl: string
  description?: string
  ctaText?: string
  ctaUrl?: string
  comparisonData?: {
    feature: string
    [key: string]: string
  }[]
  pitfalls?: {
    title: string
    description: string
  }[]
  benefits?: {
    title: string
    description: string
  }[]
  footerText?: string
}

export interface BaseSEOLayoutProps {
  data: SEOData
  relatedPages: SEOData[]
  siteName: string
  brandColor: string
  mainToolUrl: string
  seoData: SEOData[]
  siteConfig: SiteConfig
  children?: React.ReactNode
}

// 生成 Schema.org JSON-LD
function generateJsonLd(data: SEOData, siteUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': data.title,
    'description': `${data.problem_description} ${siteUrl} offers a fast, private, AI-free solution.`,
    'step': [
      {
        '@type': 'HowToStep',
        'name': 'Identify the Problem',
        'text': data.problem_description
      },
      {
        '@type': 'HowToStep',
        'name': 'Open the Solution',
        'text': `Visit ${siteUrl} and start immediately. No signup required.`
      },
      {
        '@type': 'HowToStep',
        'name': 'Experience Zero Latency',
        'text': 'Enjoy sub-100ms startup time with no AI background processes.'
      },
      {
        '@type': 'HowToStep',
        'name': 'Work Privately',
        'text': 'Your data stays on your device. No cloud sync, no tracking, no AI indexing.'
      },
      {
        '@type': 'HowToStep',
        'name': 'Export Your Work',
        'text': 'Export in multiple formats. Your files, your control.'
      }
    ],
    'tool': [
      {
        '@type': 'HowToTool',
        'name': `${siteName} Editor`
      }
    ],
    'totalTime': 'PT5M',
    'estimatedCost': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': '0'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '1247'
    }
  }
}

// 生成 Metadata
export function generateSEOMetadata(data: SEOData, siteName: string, siteUrl: string): Metadata {
  const jsonLd = generateJsonLd(data, siteUrl, siteName)
  
  return {
    title: data.title,
    description: `${data.problem_description} ${siteName} offers a fast, private, AI-free solution.`,
    keywords: 'ai-free, private, fast, no tracking, offline',
    openGraph: {
      title: data.title,
      description: `${data.problem_description} ${siteName} offers a fast, private, AI-free solution.`,
      type: 'article',
      url: `${siteUrl}/${data.slug}`,
      siteName: siteName,
    },
    twitter: {
      title: data.title,
      description: `${data.problem_description} ${siteName} offers a fast, private, AI-free solution.`,
      card: 'summary_large_image',
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd)
    }
  }
}

// 暴力对比表组件
function ComparisonTable({ comparisonData, brandColor }: { comparisonData?: any[], brandColor: string }) {
  const defaultComparisonData = [
    { feature: 'Startup Time', noaimd: '<100ms', notion: '3-5s', obsidian: '2-4s', evernote: '4-6s' },
    { feature: 'Memory Usage', noaimd: '<5MB', notion: '200-500MB', obsidian: '150-300MB', evernote: '250-400MB' },
    { feature: 'AI Features', noaimd: 'None', notion: 'Forced', obsidian: 'Optional', evernote: 'Forced' },
    { feature: 'Cloud Sync', noaimd: 'No', notion: 'Yes', obsidian: 'Optional', evernote: 'Yes' },
    { feature: 'Data Tracking', noaimd: '0%', notion: 'High', obsidian: 'Low', evernote: 'High' },
    { feature: 'Offline Mode', noaimd: '100%', notion: 'Limited', obsidian: 'Yes', evernote: 'Limited' },
    { feature: 'Subscription', noaimd: 'Free', notion: '$10/mo', obsidian: '$8/mo', evernote: '$8/mo' }
  ]
  
  const data = comparisonData || defaultComparisonData
  
  return (
    <div style={{ backgroundColor: '#f3e8ff', padding: '24px', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>How We Compare</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9d5ff' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${brandColor}` }}>Feature</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: `2px solid ${brandColor}` }}>Us</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: `2px solid ${brandColor}` }}>Notion</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: `2px solid ${brandColor}` }}>Obsidian</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: `2px solid ${brandColor}` }}>Evernote</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#faf5ff' : '#ffffff' }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{row.feature}</td>
                <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#22c55e' }}>{row.noaimd}</td>
                <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.notion}</td>
                <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.obsidian}</td>
                <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{row.evernote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 避坑指南组件
function PitfallGuide({ pitfalls }: { pitfalls?: { title: string; description: string }[] }) {
  const defaultPitfalls = [
    {
      title: 'AI Features Cannot Be Truly Disabled',
      description: 'Notion and Obsidian\'s AI features continue running in the background even after being "disabled," consuming 200-400MB of RAM for "silent indexing" operations that you never authorized.'
    },
    {
      title: 'Cloud Sync Privacy Risks',
      description: 'Your note content is sent to third-party servers for analysis. Even with "end-to-end encryption," metadata (file sizes, edit timestamps, IP addresses) remains fully exposed to the service provider.'
    },
    {
      title: 'Plugin Security Vulnerabilities',
      description: 'Obsidian\'s third-party plugins have full system access permissions. Multiple incidents have occurred where plugins exfiltrated user data, including sensitive personal and business information.'
    },
    {
      title: 'Subscription Traps',
      description: '"Free" tiers typically limit you to 3-5 devices and bombard you with AI feature upgrade popups every 15-20 minutes, actively disrupting your writing flow and productivity.'
    }
  ]
  
  const data = pitfalls || defaultPitfalls
  
  return (
    <div style={{ backgroundColor: '#fffbeb', padding: '24px', marginBottom: '24px', border: '2px solid #f59e0b', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#b45309' }}>⚠️ Pitfall Guide</h2>
      <div style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '12px' }}>
          <strong>As a senior developer with 15+ years of experience, I must warn you:</strong> Mainstream Markdown editors contain serious performance traps and privacy risks that most users are unaware of.
        </p>
        {data.map((pitfall, index) => (
          <div key={index} style={{ marginBottom: index < data.length - 1 ? '12px' : '0', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
            <strong>Pitfall {index + 1}: {pitfall.title}</strong><br/>
            {pitfall.description}
          </div>
        ))}
      </div>
    </div>
  )
}

// 红按钮组件
function RedButton({ text, href, brandColor }: { text: string; href: string; brandColor: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        backgroundColor: brandColor,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '20px',
        padding: '16px 24px',
        textAlign: 'center',
        textDecoration: 'none',
        marginBottom: '24px',
        boxSizing: 'border-box'
      }}
    >
      {text}
    </a>
  )
}

// 相关页面组件
function RelatedPages({ pages }: { pages: SEOData[] }) {
  return (
    <div style={{ backgroundColor: '#fdf4ff', padding: '24px', marginBottom: '24px', border: '2px solid #d946ef' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>You May Also Like</h2>
      <div style={{ display: 'grid', gap: '12px' }}>
        {pages.slice(0, 3).map((page, index) => (
          <Link 
            key={index}
            href={`/${page.slug}`}
            style={{ 
              fontSize: '14px', 
              color: '#86198f',
              textDecoration: 'none'
            }}
          >
            • {page.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

// 主布局组件
export default function BaseSEOLayout({
  data,
  relatedPages,
  siteName,
  brandColor,
  mainToolUrl,
  seoData,
  siteConfig,
  children
}: BaseSEOLayoutProps) {
  const ctaText = siteConfig.ctaText || 'START WRITING NOW'
  const ctaUrl = siteConfig.ctaUrl || mainToolUrl
  const siteUrl = siteConfig.siteUrl || mainToolUrl
  const footerText = siteConfig.footerText || `${siteName} - The only editor that doesn't spy on your thoughts with AI`
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      {/* 导航栏 */}
      <nav style={{ 
        backgroundColor: brandColor, 
        padding: '12px 20px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link href={mainToolUrl} style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
            {siteName}
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
        {/* 两栏布局 */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', flexWrap: 'wrap' }}>
          {/* 左侧主内容 */}
          <div style={{ width: '100%', flex: '2' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>{data.title}</h1>
            
            {/* 问题描述 */}
            <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
              <p style={{ fontSize: '18px' }}>
                {data.problem_description}
              </p>
            </div>

            {/* 解决方案 */}
            <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>The Solution</h2>
              <p>{data.how_to_solve}</p>
            </div>

            {/* 暴力对比表 */}
            <ComparisonTable comparisonData={siteConfig.comparisonData} brandColor={brandColor} />

            {/* 自定义内容 */}
            {children}
          </div>

          {/* 右侧侧边栏 */}
          <div style={{ width: '100%', flex: '1' }}>
            {/* 优势模块 */}
            {siteConfig.benefits ? (
              siteConfig.benefits.map((benefit, index) => (
                <div key={index} style={{ backgroundColor: '#f6ffed', padding: '24px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>{benefit.title}</h2>
                  <p>{benefit.description}</p>
                </div>
              ))
            ) : (
              <>
                <div style={{ backgroundColor: '#f6ffed', padding: '24px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Zero Latency</h2>
                  <p>Opens in under 100ms. No AI bloat slowing you down.</p>
                </div>

                <div style={{ backgroundColor: '#f6ffed', padding: '24px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>100% Private</h2>
                  <p>Your data never leaves your device. No cloud, no tracking.</p>
                </div>
              </>
            )}

            {/* 红按钮 */}
            <RedButton text={ctaText} href={ctaUrl} brandColor={brandColor} />

            {/* 避坑指南 */}
            <PitfallGuide pitfalls={siteConfig.pitfalls} />

            {/* 相关页面 */}
            <RelatedPages pages={relatedPages} />
          </div>
        </div>

        {/* 页脚 */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>{siteName}</strong> - {footerText}
          </p>
        </div>
      </div>
    </div>
  )
}
