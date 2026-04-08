import Link from 'next/link';
import keywordsData from '../../data/keywords.json';

export default function Home() {
  // 挑选15个最核心的词
  const quickAccessKeywords = keywordsData.slice(0, 15);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 主要内容 */}
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Solve Cross-Platform AI Memory Gap</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            BrainBridge helps you seamlessly bridge memory between different AI platforms, making your intelligent assistants truly understand your context.
          </p>
          <div className="flex gap-4">
            <a
              className="flex h-12 items-center justify-center rounded-full bg-primary px-8 text-primary-foreground transition-colors hover:bg-primary/90"
              href="/app"
            >
              Get Started
            </a>
            <a
              className="flex h-12 items-center justify-center rounded-full border border-solid border-primary/30 px-8 text-primary transition-colors hover:bg-primary/10"
              href="/pricing"
            >
              View Pricing
            </a>
          </div>
          
          {/* Browse All Alternatives 按钮 */}
          <Link 
            href="/solutions"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors rounded-md"
          >
            Browse All Alternatives
          </Link>
        </div>
      </div>

      {/* Quick Access 区域 */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAccessKeywords.map((keyword) => (
              <Link
                key={keyword.slug}
                href={`/solutions/${keyword.slug}`}
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors truncate"
              >
                {keyword.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600">
            Support: <a href="mailto:457239850@qq.com" className="text-blue-600 hover:underline">457239850@qq.com</a>
          </p>
          <p className="text-slate-500 text-sm mt-2">
            <Link href="/sitemap" className="text-blue-600 hover:underline">Sitemap</Link>
            {' | '}
            BrainBridge © 2026 | All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
