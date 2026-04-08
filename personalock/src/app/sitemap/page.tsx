import Link from 'next/link';
import keywordsData from '../../../data/keywords.json';

export default function SitemapPage() {
  const baseUrl = 'https://personalock.wangdadi.xyz';

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Sitemap
          </h1>
          <p className="text-slate-600">
            Complete list of all pages on PersonaLock
          </p>
        </header>

        {/* Main Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Main Pages
          </h2>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Home
              </Link>
              <span className="text-slate-400 ml-2 text-sm">
                {baseUrl}/
              </span>
            </li>
            <li>
              <Link 
                href="/solutions/" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Solutions Library
              </Link>
              <span className="text-slate-400 ml-2 text-sm">
                {baseUrl}/solutions/
              </span>
            </li>
          </ul>
        </section>

        {/* All Solutions */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            All Solutions ({keywordsData.length} pages)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {keywordsData.map((keyword, index) => (
              <div key={keyword.slug} className="flex items-start">
                <span className="text-slate-400 text-sm mr-2 w-8">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <Link 
                    href={`/${keyword.slug}/`} 
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    {keyword.title}
                  </Link>
                  <div className="text-slate-400 text-xs">
                    {baseUrl}/{keyword.slug}/
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* XML Sitemap Link */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            XML Sitemap
          </h2>
          <p className="text-slate-600 mb-4">
            Use this XML sitemap for search engine submission:
          </p>
          <a 
            href="/sitemap.xml" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Download XML Sitemap
          </a>
        </section>

        {/* Footer Info */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toISOString().split('T')[0]}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            © 2026 PersonaLock. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
