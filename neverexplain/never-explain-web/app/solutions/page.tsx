import { Metadata } from "next";
import Link from "next/link";
import keywords from "@/data/keywords.json";
import { Search, Code, FileText, Database, Shield, Zap } from "lucide-react";
import LiveDemoSimulator from "@/components/LiveDemoSimulator";
import Footer from "@/components/Footer";

interface Keyword {
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
}

// 分类逻辑
function categorizeKeywords(keywords: Keyword[]): Record<string, Keyword[]> {
  const categories: Record<string, Keyword[]> = {
    "API & Data Conversion": [],
    "Code Optimization": [],
    "Data Processing": [],
    "Security & Validation": [],
    "Utilities & Tools": []
  };
  
  keywords.forEach((keyword) => {
    const content = `${keyword.title} ${keyword.problem_description}`.toLowerCase();
    
    if (content.includes('api') || content.includes('curl') || content.includes('axios') || 
        content.includes('convert') || content.includes('json') || content.includes('csv')) {
      categories["API & Data Conversion"].push(keyword);
    } else if (content.includes('minify') || content.includes('compress') || 
               content.includes('optimize') || content.includes('performance')) {
      categories["Code Optimization"].push(keyword);
    } else if (content.includes('data') || content.includes('parse') || 
               content.includes('format') || content.includes('process')) {
      categories["Data Processing"].push(keyword);
    } else if (content.includes('security') || content.includes('validate') || 
               content.includes('password') || content.includes('hash') || 
               content.includes('encrypt')) {
      categories["Security & Validation"].push(keyword);
    } else {
      categories["Utilities & Tools"].push(keyword);
    }
  });
  
  return categories;
}

// 生成元数据
export const metadata: Metadata = {
  title: "All Solutions - The 2026 AI Workflow Guide",
  description: "Browse our comprehensive collection of 100+ developer tools and solutions for API conversion, code optimization, data processing, and more.",
  openGraph: {
    title: "All Solutions - The 2026 AI Workflow Guide",
    description: "Browse our comprehensive collection of 100+ developer tools and solutions for API conversion, code optimization, data processing, and more.",
    type: "website"
  }
};

// 获取分类图标
function getCategoryIcon(category: string) {
  switch (category) {
    case "API & Data Conversion":
      return <Code className="w-5 h-5" />;
    case "Code Optimization":
      return <Zap className="w-5 h-5" />;
    case "Data Processing":
      return <Database className="w-5 h-5" />;
    case "Security & Validation":
      return <Shield className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getPopularKeywords(keywords: Keyword[]): Keyword[] {
  const shuffled = [...keywords].sort((a, b) => {
    const hashA = hashString(a.slug);
    const hashB = hashString(b.slug);
    return hashA - hashB;
  });
  return shuffled.slice(0, 20);
}

function getContextDescription(keyword: Keyword, category: string): string {
  const keywordName = keyword.keyword || keyword.title.split(' ')[0];
  return `Stop explaining ${keywordName} to Claude. Use this hook to inject your ${category} logic instantly.`;
}

export default function SolutionsPage() {
  const categories = categorizeKeywords(keywords as Keyword[]);
  
  // 生成 FAQ 数据
  const faqData = [
    {
      question: "How do I synchronize project context across multiple AI platforms?",
      answer: "NeverExplain's /recall hooks work seamlessly across ChatGPT, Claude, and other AI platforms. Store your context once and access it anywhere using the unique hook name.",
      acceptedAnswer: {
        text: "NeverExplain's /recall hooks work seamlessly across ChatGPT, Claude, and other AI platforms. Store your context once and access it anywhere using the unique hook name."
      }
    },
    {
      question: "What makes context hooks better than manual copy-pasting?",
      answer: "Context hooks eliminate the need for repetitive manual copying, reduce human error, maintain consistency across conversations, and dramatically speed up your workflow by up to 80%.",
      acceptedAnswer: {
        text: "Context hooks eliminate the need for repetitive manual copying, reduce human error, maintain consistency across conversations, and dramatically speed up your workflow by up to 80%."
      }
    },
    {
      question: "Can I use NeverExplain for both development and marketing workflows?",
      answer: "Absolutely! NeverExplain is designed for cross-functional teams. Developers can store technical specs and API configurations, while marketers can save brand guidelines and audience personas—all using the same /recall system.",
      acceptedAnswer: {
        text: "Absolutely! NeverExplain is designed for cross-functional teams. Developers can store technical specs and API configurations, while marketers can save brand guidelines and audience personas—all using the same /recall system."
      }
    },
    {
      question: "How secure are the contexts I store in NeverExplain?",
      answer: "Your contexts are stored securely with end-to-end encryption. You retain full control over your data and can delete contexts at any time. We never use your stored contexts for training purposes.",
      acceptedAnswer: {
        text: "Your contexts are stored securely with end-to-end encryption. You retain full control over your data and can delete contexts at any time. We never use your stored contexts for training purposes."
      }
    },
    {
      question: "What's the learning curve for using /recall hooks?",
      answer: "Virtually zero! If you can type a slash command, you can use NeverExplain. Store your context once with a memorable hook name, then type /recall-xxx in any conversation to retrieve it instantly.",
      acceptedAnswer: {
        text: "Virtually zero! If you can type a slash command, you can use NeverExplain. Store your context once with a memorable hook name, then type /recall-xxx in any conversation to retrieve it instantly."
      }
    }
  ];
  
  // 生成 JSON-LD 结构化数据
  const itemListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Developer Tools and Solutions",
    "description": "A comprehensive collection of 100+ developer tools and solutions",
    "numberOfItems": keywords.length,
    "itemListElement": keywords.map((keyword, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": keyword.title,
      "description": keyword.problem_description,
      "url": `https://neverexplain.wangdadi.xyz/solutions/${keyword.slug}`
    }))
  };
  
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* 面包屑导航 */}
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900">Solutions</span>
        </div>
      </nav>
      
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search 100+ solutions..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none focus:outline-none focus:border-blue-500 text-lg"
                id="search-input"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 my-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4">
            All Solutions
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Browse our comprehensive collection of 100+ developer tools and solutions. 
            From API conversion to code optimization, find the perfect tool for your workflow.
          </p>
        </header>
        
        {/* 实时演示模拟器 */}
        <LiveDemoSimulator />
        
        {/* 深度导论 */}
        <article className="mb-12 bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold text-slate-900">
              The End of Repetitive Prompting: Why Context Hooks are the Future of AI Workflows
            </h2>
          </div>
          <div className="text-lg text-slate-600 leading-relaxed space-y-4">
            <p>
              In 2026, LLMs like ChatGPT and Claude have become indispensable tools for developers and knowledge workers alike. Yet, a fundamental flaw persists: every new conversation means starting from scratch. The cognitive load of re-explaining project backgrounds, technical specifications, and brand guidelines across multiple platforms has created what we call &quot;Context Fatigue.&quot;
            </p>
            <p>
              The root cause lies in how current AI systems handle context. Traditional methods like manual copy-pasting are error-prone and time-consuming, while built-in memory features often lack cross-platform compatibility. This results in lost productivity, inconsistent outputs, and frustrated teams wasting hours on repetitive tasks that could be automated.
            </p>
            <p>
              Context hooks represent a paradigm shift. By storing project information once and retrieving it instantly with a simple /recall-xxx command, we eliminate the friction of context switching. This approach not only saves time but also ensures consistency across conversations, platforms, and team members—fundamentally changing how we interact with AI.
            </p>
          </div>
        </article>
        
        {/* 工作流对比图 */}
        <section className="mb-12 bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold text-slate-900">
              Workflow Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Feature
                  </th>
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Manual Copy-Paste
                  </th>
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Custom Instructions
                  </th>
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    NeverExplain (/recall)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-slate-200 px-6 py-4 text-sm font-medium text-slate-900">
                    Speed
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Slow (minutes per conversation)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Medium (setup once, but limited)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-red-600 font-medium">
                    Instant (one command)
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 px-6 py-4 text-sm font-medium text-slate-900">
                    Multi-project handling
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Poor (easy to mix up contexts)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Limited (one instruction at a time)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-red-600 font-medium">
                    Excellent (unlimited projects)
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-slate-200 px-6 py-4 text-sm font-medium text-slate-900">
                    Platform Agnostic
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Yes (but manual)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    No (platform-specific)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-red-600 font-medium">
                    Yes (cross-AI sync)
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 px-6 py-4 text-sm font-medium text-slate-900">
                    Accuracy
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Low (human error common)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                    Medium (limited space)
                  </td>
                  <td className="border border-slate-200 px-6 py-4 text-sm text-red-600 font-medium">
                    High (perfect consistency)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* 动态 FAQ */}
        <section className="mb-12 bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
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
        
        {/* Category Navigation */}
        <nav className="mb-12">
          <div className="flex flex-wrap gap-4">
            {Object.keys(categories).map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-500 transition-colors"
              >
                <span className="text-slate-400">{getCategoryIcon(category)}</span>
                <span className="text-slate-700 font-medium">{category}</span>
                <span className="text-slate-400">({categories[category].length})</span>
              </a>
            ))}
          </div>
        </nav>
        
        {/* Categories */}
        {Object.entries(categories).map(([category, categoryKeywords]) => (
          <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-8 bg-red-600"></div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="text-slate-400">{getCategoryIcon(category)}</span>
                {category}
              </h2>
              <span className="text-slate-400">({categoryKeywords.length} solutions)</span>
            </div>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryKeywords.map((keyword) => (
                <article
                  key={keyword.slug}
                  className="bg-white border border-slate-200 p-8 hover:bg-blue-50 hover:border-blue-500 transition-colors solution-card"
                  data-title={keyword.title.toLowerCase()}
                  data-description={keyword.problem_description.toLowerCase()}
                >
                  <Link href={`/solutions/${keyword.slug}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 hover:text-blue-600">
                      {keyword.title}
                    </h3>
                    <p className="text-blue-600 font-medium mb-3">
                      {getContextDescription(keyword, category)}
                    </p>
                    <p className="text-slate-600 leading-relaxed line-clamp-3">
                      {keyword.problem_description.substring(0, 150)}...
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      
      {/* Popular Contexts Keyword Cloud */}
      <section className="max-w-7xl mx-auto px-6 mt-16 mb-16">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold text-slate-900">
              Popular Contexts
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {getPopularKeywords(keywords as Keyword[]).map((keyword) => (
              <Link 
                key={keyword.slug}
                href={`/solutions/${keyword.slug}`}
                className="px-4 py-2 border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {keyword.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Client-side Search Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('search-input').addEventListener('input', function(e) {
              const searchTerm = e.target.value.toLowerCase();
              const cards = document.querySelectorAll('.solution-card');
              
              cards.forEach(card => {
                const title = card.getAttribute('data-title') || '';
                const description = card.getAttribute('data-description') || '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                  card.style.display = 'block';
                } else {
                  card.style.display = 'none';
                }
              });
            });
          `
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
