import Link from 'next/link';
import keywordsData from '../../../data/keywords.json';

export const metadata = {
  title: 'Sitemap - BrainBridge',
  description: 'Complete sitemap of all AI workflow solutions on BrainBridge',
};

export default function SitemapPage() {
  const domain = 'https://brainbridge.wangdadi.xyz';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Sitemap
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 mt-4">
            Complete list of all AI workflow solutions on BrainBridge
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 主要页面 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Main Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/"
              className="p-4 bg-white border border-slate-200 hover:border-blue-500 transition-colors"
            >
              <h3 className="font-bold text-slate-900">Home</h3>
              <p className="text-sm text-slate-600 mt-1">BrainBridge - AI Memory Bridge</p>
            </Link>
            <Link
              href="/solutions"
              className="p-4 bg-white border border-slate-200 hover:border-blue-500 transition-colors"
            >
              <h3 className="font-bold text-slate-900">AI Workflow Solutions</h3>
              <p className="text-sm text-slate-600 mt-1">Browse all {keywordsData.length} solutions</p>
            </Link>
            <Link
              href="/pricing"
              className="p-4 bg-white border border-slate-200 hover:border-blue-500 transition-colors"
            >
              <h3 className="font-bold text-slate-900">Pricing</h3>
              <p className="text-sm text-slate-600 mt-1">Lifetime access for $6.9</p>
            </Link>
          </div>
        </section>

        {/* 所有解决方案 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            All Solutions ({keywordsData.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordsData.map((keyword) => (
              <Link
                key={keyword.slug}
                href={`/solutions/${keyword.slug}`}
                className="p-4 bg-white border border-slate-200 hover:border-blue-500 transition-colors"
              >
                <h3 className="font-bold text-slate-900 line-clamp-1">
                  {keyword.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {keyword.problem_description}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {domain}/solutions/{keyword.slug}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600">
          <p>
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
