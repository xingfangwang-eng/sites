import { Metadata } from "next";
import Link from "next/link";
import { generatePageConfig } from "@/lib/seo-engine";
import { enhanceContent, categorizeKeyword } from "@/lib/content-enhancer";
import { generateContent } from "@/lib/content-generator";
import keywords from "@/data/keywords.json";

// 导入组件
import HeroVariantA from "@/components/seo/HeroVariantA";
import HeroVariantB from "@/components/seo/HeroVariantB";
import HeroVariantC from "@/components/seo/HeroVariantC";
import RelatedSolutions from "@/components/RelatedSolutions";
import JsonLd from "@/components/JsonLd";
import WorkflowLossCalculator from "@/components/WorkflowLossCalculator";
import DeepComparisonTable from "@/components/DeepComparisonTable";
import Footer from "@/components/Footer";
import PowerToolsSuite from "@/components/PowerToolsSuite";

interface Keyword {
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
}

// 生成静态参数
export async function generateStaticParams() {
  return keywords.map((keyword: any) => ({
    slug: keyword.slug
  }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  // 在 Next.js 16 中，params 是一个 Promise
  const resolvedParams = await params;
  const keyword = keywords.find((k: any) => k.slug === resolvedParams.slug);
  
  if (!keyword) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    };
  }
  
  // 生成动态标题
  const dynamicTitle = `${keyword.title} - The 2026 AI Workflow Guide`;
  
  // 生成唯一的 og:image
  const ogImage = `https://neeko-copilot.bytedance.net/api/text2image?prompt=${encodeURIComponent(keyword.title)}&size=1200x630`;
  
  return {
    title: dynamicTitle,
    description: keyword.how_to_solve?.substring(0, 160) || '',
    openGraph: {
      title: dynamicTitle,
      description: keyword.how_to_solve?.substring(0, 160) || '',
      type: 'article',
      images: [ogImage]
    }
  };
}

// 渲染组件的函数
function renderHero(variant: string) {
  switch (variant) {
    case 'A':
      return <HeroVariantA />;
    case 'B':
      return <HeroVariantB />;
    case 'C':
      return <HeroVariantC />;
    default:
      return <HeroVariantA />;
  }
}

// 获取随机同类关键词
function getRandomSimilarKeyword(currentSlug: string, allKeywords: any[]): Keyword | null {
  const currentKeyword = allKeywords.find((k: any) => k.slug === currentSlug);
  if (!currentKeyword) return null;
  
  const currentCategory = categorizeKeyword(currentKeyword as Keyword);
  const similarKeywords = allKeywords.filter((k: any) => 
    k.slug !== currentSlug && 
    categorizeKeyword(k as Keyword) === currentCategory
  );
  
  if (similarKeywords.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * similarKeywords.length);
  return similarKeywords[randomIndex] as Keyword;
}

// 主页面组件
export default async function SolutionPage({ params }: { params: any }) {
  // 在 Next.js 16 中，params 是一个 Promise
  const resolvedParams = await params;
  const keyword = keywords.find((k: any) => k.slug === resolvedParams.slug);
  
  if (!keyword) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <p className="text-slate-600 mb-8">The page you are looking for does not exist.</p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors active:scale-95"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  
  // 获取页面配置
  const pageConfig = generatePageConfig(resolvedParams.slug);
  
  // 增强内容
  const enhancedContent = enhanceContent(keyword as Keyword);
  
  // 生成内容
  const generatedContent = generateContent(keyword as Keyword);
  
  // 计算字数
  const wordCount = generatedContent.split(/\s+/).filter(word => word.length > 0).length;
  console.log(`Page for ${keyword.slug}: ${wordCount} words`);
  
  // 生成结构化数据
  const currentUrl = `https://neverexplain.wangdadi.xyz/solutions/${resolvedParams.slug}`;
  
  const softwareApplicationData = {
    name: keyword.title,
    applicationCategory: enhancedContent.category,
    url: currentUrl,
    description: keyword.how_to_solve?.substring(0, 160) || '',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  };
  
  // 分割 how_to_solve 为步骤
  const steps = keyword.how_to_solve
    ? keyword.how_to_solve
        .split('. ')
        .filter(step => step.trim().length > 0)
        .map(step => step.trim() + '.')
    : [];
  
  const howToData = {
    name: keyword.title,
    description: keyword.problem_description,
    steps: steps
  };
  
  // 获取随机同类关键词
  const randomSimilarKeyword = getRandomSimilarKeyword(resolvedParams.slug, keywords);
  
  // 解析生成的内容
  const contentSections = generatedContent.split('## ').filter(section => section.trim().length > 0);
  const introductionSection = contentSections.find(section => section.startsWith('Introduction'));
  const technicalDeepDiveSection = contentSections.find(section => section.startsWith('Technical Deep Dive'));
  const solutionSection = contentSections.find(section => section.startsWith('Solution: The /recall Workflow'));
  const comparisonSection = contentSections.find(section => section.startsWith('Comparison & Summary'));
  
  // 提取技术深度部分的代码块
  const extractCodeBlock = (section: string) => {
    const codeMatch = section.match(/```[\s\S]*?```/);
    if (codeMatch) {
      return codeMatch[0];
    }
    return null;
  };
  
  const codeBlock = technicalDeepDiveSection ? extractCodeBlock(technicalDeepDiveSection) : null;
  
  // 获取分类用于计算器和对比表
  const category = enhancedContent.category.toLowerCase();
  const tableCategory = category === 'coding' ? 'coding' : category === 'marketing' ? 'copywriting' : 'general';
  const displayCategory = enhancedContent.category;
  
  // 生成面包屑导航 Schema 数据
  const breadcrumbListData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://neverexplain.wangdadi.xyz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Solutions",
        "item": "https://neverexplain.wangdadi.xyz/solutions"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": displayCategory,
        "item": `https://neverexplain.wangdadi.xyz/solutions#${displayCategory.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": keyword.title,
        "item": `https://neverexplain.wangdadi.xyz/solutions/${resolvedParams.slug}`
      }
    ]
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* JSON-LD 结构化数据 */}
      <JsonLd type="SoftwareApplication" data={softwareApplicationData} />
      <JsonLd type="HowTo" data={howToData} />
      <JsonLd type="BreadcrumbList" data={breadcrumbListData} />
      
      {/* 面包屑导航 UI */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="text-slate-400">/</span>
          <Link href="/solutions" className="hover:text-slate-700">Solutions</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-700">{displayCategory}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900">{keyword.title}</span>
        </div>
      </nav>
      
      {/* 渲染 Hero 组件 */}
      {renderHero(pageConfig.layout.hero)}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <article className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-8">
            {/* 标题 */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{keyword.title}</h1>
              {/* GEO 一句话总结 */}
              <p className="text-red-600 font-medium mb-4">
                {`${keyword.title}: A comprehensive guide to ${keyword.problem_description.toLowerCase().replace(/\.$/, '')}. Use the /recall workflow to instantly inject context and save time.`}
              </p>
              <p className="text-lg text-slate-600">{keyword.problem_description}</p>
            </header>
            
            {/* Introduction 部分 */}
            {introductionSection && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                <div className="text-lg text-slate-600 leading-relaxed">
                  {introductionSection.replace('Introduction\n', '')}
                </div>
                
                {/* 内链增强 */}
                {randomSimilarKeyword && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 font-medium">
                      Pro Tip: This approach also works for <a href={`/solutions/${randomSimilarKeyword.slug}`} className="text-red-600 hover:underline">{randomSimilarKeyword.title}</a>
                    </p>
                  </div>
                )}
              </section>
            )}
            
            {/* 工作流损失计算器 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Workflow Loss Calculator</h2>
              <WorkflowLossCalculator category={category as "coding" | "marketing" | "general"} />
            </section>
            
            {/* Technical Deep Dive 部分 */}
            {technicalDeepDiveSection && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Technical Deep Dive</h2>
                <div className="text-lg text-slate-600 leading-relaxed mb-6">
                  {technicalDeepDiveSection.replace('Technical Deep Dive\n', '').replace(/```[\s\S]*?```/, '')}
                </div>
                
                {/* 代码块 */}
                {codeBlock && (
                  <figure className="mb-6">
                    <pre className="bg-slate-50 border border-slate-200 rounded-md p-4 overflow-x-auto">
                      <code>{codeBlock.replace(/```/g, '')}</code>
                    </pre>
                    <figcaption className="text-sm text-slate-500 mt-2">Code Example</figcaption>
                  </figure>
                )}
              </section>
            )}
            
            {/* 深度对比表 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Deep Comparison</h2>
              <DeepComparisonTable category={tableCategory as "coding" | "copywriting" | "general"} />
            </section>
            
            {/* Solution 部分 */}
            {solutionSection && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Solution: The /recall Workflow</h2>
                <div className="text-lg text-slate-600 leading-relaxed">
                  {solutionSection.replace('Solution: The /recall Workflow\n', '')}
                </div>
              </section>
            )}
            
            {/* FAQ 部分 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {enhancedContent.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Comparison & Summary 部分 */}
            {comparisonSection && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Comparison & Summary</h2>
                <div className="text-lg text-slate-600 leading-relaxed">
                  {comparisonSection.replace('Comparison & Summary\n', '')}
                </div>
              </section>
            )}
            
            {/* 相关解决方案 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Solutions</h2>
              <RelatedSolutions currentKeyword={keyword as Keyword} allKeywords={keywords as Keyword[]} />
            </section>
          </div>
        </article>
        
        {/* Power Tools Suite */}
        <div className="max-w-7xl mx-auto px-4 mt-12 mb-12">
          <PowerToolsSuite currentSlug={resolvedParams.slug} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
