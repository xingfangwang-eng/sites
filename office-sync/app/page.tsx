import Layout from "./components/Layout";
import Link from "next/link";
import keywords from "@/data/keywords.json";

export default function Home() {
  // 从 100 个词中挑选 15 个最核心的词
  const quickAccessKeywords = keywords.slice(0, 15);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">
              StealthPlay
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              The ultimate solution for gaming at work without getting caught. Disguise your gaming sessions as productive work applications.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/solutions"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-md transition-colors"
              >
                Browse All Alternatives
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 p-8 rounded-md">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Undetectable</h3>
              <p className="text-slate-600">
                Advanced technology that bypasses all major monitoring systems without leaving a trace.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-md">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Switch</h3>
              <p className="text-slate-600">
                Switch between gaming and work mode in under 100ms with our boss-key functionality.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-md">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customizable</h3>
              <p className="text-slate-600">
                Choose from multiple disguise modes including Excel, VS Code, and more.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-200">
          <h2 className="text-sm font-medium text-slate-500 mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickAccessKeywords.map((keyword) => (
              <Link
                key={keyword.slug}
                href={`/solutions/${keyword.slug}`}
                className="text-xs text-slate-400 hover:text-blue-600 transition-colors truncate"
              >
                {keyword.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-4">
              <Link href="/sitemap" className="text-slate-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
            <p className="text-slate-400">
              Support: <a href="mailto:457239850@qq.com" className="text-blue-400 hover:text-blue-300">457239850@qq.com</a>
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
