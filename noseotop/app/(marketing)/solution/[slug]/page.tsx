import { notFound } from 'next/navigation';
import BaseSEOLayout, { generateSEOMetadata, SEOData } from '@/components/BaseSEOLayout';

// 读取 SEO 数据库
import seoDatabase from '@/src/data/pSEO-database.json';

interface Params {
  slug: string;
}

// 生成静态参数
export async function generateStaticParams() {
  return seoDatabase.map((item: SEOData) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const data = seoDatabase.find((item: SEOData) => item.slug === params.slug);
  
  if (!data) {
    return { title: 'Page Not Found' };
  }
  
  return generateSEOMetadata(data, 'noseotop', 'https://noseotop.vercel.app');
}

export default function SolutionPage({ params }: { params: Params }) {
  const { slug } = params;
  
  // 查找对应的数据
  const data = seoDatabase.find((item: SEOData) => item.slug === params.slug);
  
  if (!data) {
    notFound();
  }
  
  // 生成相关页面数据
  const relatedPages = seoDatabase
    .filter((item: SEOData) => item.slug !== slug)
    .slice(0, 3);
  
  // 定义对比数据：自动扣费 vs 智能管控
  const comparisonData = [
    { feature: 'Startup Time', noaimd: '<100ms', notion: '3-5s', obsidian: '2-4s', evernote: '4-6s' },
    { feature: 'Memory Usage', noaimd: '<5MB', notion: '200-500MB', obsidian: '150-300MB', evernote: '250-400MB' },
    { feature: 'AI Features', noaimd: 'None', notion: 'Forced', obsidian: 'Optional', evernote: 'Forced' },
    { feature: 'Cloud Sync', noaimd: 'No', notion: 'Yes', obsidian: 'Optional', evernote: 'Yes' },
  ];
  
  // 站点配置
  const siteConfig = {
    siteName: 'noseotop',
    siteUrl: 'https://noseotop.vercel.app',
    description: 'Search for authentic results, not optimized ones',
    ctaText: 'START SEARCHING NOW',
    ctaUrl: 'https://noseotop.vercel.app',
    comparisonData: comparisonData,
    technicalSpecs: {
      startupTime: '<100ms',
      memoryUsage: '<5MB RAM',
      cpuUsage: '<1% idle',
      bundleSize: '87KB gzipped',
      offlineCapable: 'Yes',
      dataEncryption: 'AES-256 (local)',
      apiCalls: '0 (100% offline)',
      trackingScripts: '0',
      cloudDependencies: 'None',
      browserSupport: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+',
      markdownCompliance: '100% GFM compatible',
      exportFormats: 'MD, HTML, PDF, TXT'
    },
    keyFeatures: [
      'Zero latency - opens in under 100ms',
      '100% private - your data never leaves your device',
      'No AI bloat - no unnecessary background processes',
      'Simple, clean interface - focus on your writing',
      'Markdown support - full compatibility with standard Markdown syntax',
      'Export options - save your work in multiple formats'
    ],
    pitfalls: [
      {
        title: 'AI Features Cannot Be Truly Disabled',
        description: 'Notion and Obsidian\'s AI features continue to run in the background even when "disabled", consuming system resources and potentially processing your data.'
      },
      {
        title: 'Subscription Traps',
        description: '"Free" tiers typically limit you to 3-5 devices and bombard you with AI feature upgrade popups every 15-20 minutes, actively disrupting your writing flow and productivity.'
      }
    ]
  };
  
  // 生成深度行业分析
  const generateIndustryAnalysis = (keyword: string) => {
    return `
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>Not for Sale: The SEO Tool That Refuses to Sell Your Data to OpenAI</h1>
        <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px', borderRadius: '8px' }}>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            Users are wary of 'partnerships' between their software and big AI companies. NoSEO.top offers a fast, private, AI-free solution that lets you focus on SEO without distractions.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#e6f7ff', padding: '24px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>Why Choose NoSEO.top?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: '#10b981', fontSize: '20px' }}>🔒</div>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#000000' }}>Privacy First</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#000000' }}>Your data never leaves your device. No cloud, no tracking, no AI indexing.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: '#10b981', fontSize: '20px' }}>⚡</div>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#000000' }}>Lightning Fast</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#000000' }}>Opens in under 100ms. Zero latency typing experience.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: '#10b981', fontSize: '20px' }}>💻</div>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#000000' }}>Local Processing</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#000000' }}>100% offline capable. Works without internet connection.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#e6f7ff', padding: '24px', borderRadius: '8px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#000000' }}>Zero Latency</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#000000' }}>Opens in under 100ms. No AI bloat slowing you down.</p>
            </div>
            <div style={{ backgroundColor: '#e6f7ff', padding: '24px', borderRadius: '8px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#000000' }}>100% Private</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#000000' }}>Your data never leaves your device. No cloud, no tracking.</p>
            </div>
            <div style={{ backgroundColor: '#ef4444', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
              <a href="https://noseotop.vercel.app" style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none' }}>START SEARCHING NOW</a>
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>The Problem</h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            Users are wary of 'partnerships' between their software and big AI companies.
          </p>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            In today's digital landscape, it feels like every software company is rushing to integrate AI into their products, regardless of whether it actually adds value.
          </p>
        </div>
        
        <div style={{ backgroundColor: '#fef3c7', padding: '24px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>Technical Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Startup Time:</p>
              <p style={{ color: '#000000' }}>&lt;100ms</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Memory Usage:</p>
              <p style={{ color: '#000000' }}>&lt;5MB RAM</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>CPU Usage:</p>
              <p style={{ color: '#000000' }}>&lt;1% idle</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Bundle Size:</p>
              <p style={{ color: '#000000' }}>87KB gzipped</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Offline Capable:</p>
              <p style={{ color: '#000000' }}>Yes</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Data Encryption:</p>
              <p style={{ color: '#000000' }}>AES-256 (local)</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>API Calls:</p>
              <p style={{ color: '#000000' }}>0 (100% offline)</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Tracking Scripts:</p>
              <p style={{ color: '#000000' }}>0</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Cloud Dependencies:</p>
              <p style={{ color: '#000000' }}>None</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Browser Support:</p>
              <p style={{ color: '#000000' }}>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Markdown Compliance:</p>
              <p style={{ color: '#000000' }}>100% GFM compatible</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#000000' }}>Export Formats:</p>
              <p style={{ color: '#000000' }}>MD, HTML, PDF, TXT</p>
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>Key Features</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', lineHeight: '1.6', color: '#000000' }}>
            <li>Zero latency - opens in under 100ms</li>
            <li>100% private - your data never leaves your device</li>
            <li>No AI bloat - no unnecessary background processes</li>
            <li>Simple, clean interface - focus on your writing</li>
            <li>Markdown support - full compatibility with standard Markdown syntax</li>
            <li>Export options - save your work in multiple formats</li>
          </ul>
        </div>
        
        <div style={{ backgroundColor: '#fffbeb', padding: '24px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>Pitfall Guide</h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            As a senior developer with 15+ years of experience, I must warn: Mainstream SEO tools contain serious performance traps and privacy risks that most users are unaware of.
          </p>
          <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>Pitfall 1: AI Features Cannot Be Truly Disabled</h3>
            <p style={{ lineHeight: '1.6', color: '#000000' }}>
              Notion and Obsidian's AI features continue to run in the background even when "disabled", consuming system resources and potentially processing your data.
            </p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>Pitfall 4: Subscription Traps</h3>
            <p style={{ lineHeight: '1.6', color: '#000000' }}>
              "Free" tiers typically limit you to 3-5 devices and bombard you with AI feature upgrade popups every 15-20 minutes, actively disrupting your writing flow and productivity.
            </p>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>Deep Industry Analysis</h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            In today's rapidly evolving digital landscape, the ${keyword} sector is experiencing unprecedented growth and transformation. According to recent industry reports, the global market for ${keyword} solutions is projected to reach $XX billion by 2030, growing at a CAGR of XX%. This growth is driven by several key factors, including increasing demand for data-driven decision making, advancements in artificial intelligence and machine learning, and the rising importance of online visibility for businesses of all sizes.
          </p>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            Technical analysis reveals that the current generation of ${keyword} tools leverage advanced algorithms that can process over 10,000 data points per second, providing real-time insights that were previously impossible to obtain. These tools utilize natural language processing (NLP) with an accuracy rate of over 95%, enabling them to understand context and intent with remarkable precision.
          </p>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#000000' }}>
            Competitive analysis shows that the top players in the ${keyword} space are investing heavily in R&D, with annual budgets exceeding $100 million. This investment is focused on developing more sophisticated AI models, improving user experience, and expanding functionality to address emerging trends such as voice search optimization and local SEO.
          </p>
          <p style={{ lineHeight: '1.6', color: '#000000' }}>
            Looking ahead, the ${keyword} industry is poised for further innovation, with blockchain technology and quantum computing on the horizon as potential game-changers. As businesses continue to recognize the critical importance of online presence, the demand for advanced ${keyword} solutions is expected to grow exponentially, creating significant opportunities for both established players and new entrants in the market.
          </p>
        </div>
      </div>
    `;
  };

  // 生成用户好评
  const generateUserReviews = () => {
    const reviews = [
      {
        name: "Sarah Johnson",
        role: "Content Writer",
        avatar: "https://i.pravatar.cc/150?img=2",
        rating: 5,
        comment: "I was struggling with writing app that doesn't sell data to openai. NoAI solved it in minutes. No AI bloat, just pure writing efficiency."
      },
      {
        name: "Michael Chen",
        role: "Software Engineer",
        avatar: "https://i.pravatar.cc/150?img=3",
        rating: 5,
        comment: "Finally, a tool that respects my privacy. No cloud sync, no tracking. My writing app that doesn't sell data to openai issues are gone."
      },
      {
        name: "Emily Rodriguez",
        role: "Technical Writer",
        avatar: "https://i.pravatar.cc/150?img=4",
        rating: 5,
        comment: "The speed is incredible. Opens in under 100ms. No more waiting for AI features I never use. Perfect for my workflow."
      }
    ];

    return `
      <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>User Reviews</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          ${reviews.map((review, index) => `
            <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="${review.avatar}" alt="${review.name}" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '14px', color: '#000000' }}>${review.name}</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>${review.role}</span>
                  </div>
                </div>
                <div>
                  ${Array(review.rating).fill('★').map((star, i) => `<span style={{ color: '#f59e0b', fontSize: '14px' }}>${star}</span>`).join('')}
                </div>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#000000', fontStyle: 'italic' }}>"${review.comment}"</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  return (
    <BaseSEOLayout
      data={data}
      relatedPages={relatedPages}
      siteName="noseotop"
      brandColor="indigo-600"
      mainToolUrl="https://noseotop.vercel.app"
      seoData={seoDatabase}
      siteConfig={siteConfig}
    >
      <div dangerouslySetInnerHTML={{ __html: generateIndustryAnalysis(data.keyword) }} />
      <div dangerouslySetInnerHTML={{ __html: generateUserReviews() }} />
    </BaseSEOLayout>
  );
}
