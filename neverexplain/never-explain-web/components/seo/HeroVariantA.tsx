import { Code, ArrowRight } from "lucide-react";

export default function HeroVariantA() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <Code size={16} />
              Programmatic SEO
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">
              Generate 100+ SEO-Friendly Landing Pages
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Automatically create static landing pages for niche questions with our powerful pSEO solution. 
              Improve your search rankings and drive targeted traffic to your website.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors active:scale-95 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 border border-slate-300 text-slate-900 font-medium rounded-md hover:bg-slate-100 transition-colors">
                View Demo
              </button>
            </div>
          </div>
          
          {/* Right Code Preview */}
          <div className="bg-slate-900 rounded-lg overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-slate-400">code.tsx</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono">
                <code>
{`// Generate static pages from keywords
import keywords from "@/data/keywords.json";

export async function generateStaticParams() {
  return keywords.map(keyword => ({
    slug: keyword.slug
  }));
}

export default function SlugPage({ params }) {
  const keyword = keywords.find(k => k.slug === params.slug);
  
  return (
    <div className="min-h-screen">
      <h1>{keyword.title}</h1>
      {/* Content */}
    </div>
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}