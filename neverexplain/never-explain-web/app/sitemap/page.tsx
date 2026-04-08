import Link from "next/link";
import keywords from "@/data/keywords.json";
import { categorizeKeyword } from "@/lib/content-enhancer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sitemap - NeverExplain",
  description: "Complete sitemap of all tools and solutions on NeverExplain",
};

export default function SitemapPage() {
  const categories = {};
  keywords.forEach((keyword) => {
    const category = categorizeKeyword(keyword);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(keyword);
  });

  const categoryNames = {
    coding: "Coding & Development Tools",
    marketing: "Marketing & Content Tools",
    general: "General Productivity Tools"
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">Sitemap</span>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
            Sitemap
          </h1>
          <p className="text-lg text-slate-600">
            Complete list of all tools and solutions on NeverExplain
          </p>
        </div>

        {/* Main Pages */}
        <section className="mb-12 bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold text-slate-900">
              Main Pages
            </h2>
          </div>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="text-lg text-blue-600 hover:text-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="text-lg text-blue-600 hover:text-blue-700">
                Browse All Solutions
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="text-lg text-blue-600 hover:text-blue-700">
                Workflow Loss Calculator
              </Link>
            </li>
            <li>
              <Link href="/comparison" className="text-lg text-blue-600 hover:text-blue-700">
                Deep Comparison Table
              </Link>
            </li>
          </ul>
        </section>

        {/* Solutions by Category */}
        {Object.entries(categories).map(([category, categoryKeywords]) => (
          <section key={category} className="mb-12 bg-white border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1 h-8 bg-red-600"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                {categoryNames[category as keyof typeof categoryNames]}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryKeywords.map((keyword) => (
                <div key={keyword.slug} className="text-slate-700">
                  <Link 
                    href={`/solutions/${keyword.slug}`}
                    className="text-lg text-blue-600 hover:text-blue-700"
                  >
                    {keyword.title}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
