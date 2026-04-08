import Link from 'next/link';
import keywords from '@/data/keywords.json';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
          Sitemap
        </h1>
        <p className="text-lg text-slate-600 mb-12">
          Complete list of all stealth gaming solutions available on office-sync.wangdadi.xyz
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keywords.map((keyword) => (
            <div key={keyword.slug} className="bg-white border border-slate-200 p-4 rounded-md">
              <Link
                href={`/solutions/${keyword.slug}`}
                className="text-slate-900 hover:text-blue-600 font-medium transition-colors"
              >
                {keyword.title}
              </Link>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {keyword.problem_description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Main Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-md">
              <Link
                href="/"
                className="text-slate-900 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </Link>
              <p className="text-sm text-slate-500 mt-1">
                StealthPlay - The ultimate solution for gaming at work
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-md">
              <Link
                href="/solutions"
                className="text-slate-900 hover:text-blue-600 font-medium transition-colors"
              >
                Solutions
              </Link>
              <p className="text-sm text-slate-500 mt-1">
                Browse all 100+ stealth gaming solutions
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400">
            Support: <a href="mailto:457239850@qq.com" className="text-blue-400 hover:text-blue-300">457239850@qq.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
