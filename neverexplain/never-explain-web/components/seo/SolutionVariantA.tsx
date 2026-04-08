import { ArrowRight, CheckCircle, Code, Database, Globe } from "lucide-react";

export default function SolutionVariantA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our solution makes it easy to generate SEO-friendly landing pages in just 3 simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Database size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Prepare Your Data</h3>
            <p className="text-slate-600 mb-6">
              Create a JSON file with your target keywords, titles, and descriptions. 
              Our system will use this data to generate landing pages.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <pre className="text-sm text-slate-700 font-mono">
                <code>
{`{
  "slug": "convert-curl-to-axios",
  "title": "How to Convert cURL to Axios",
  "problem_description": "...",
  "how_to_solve": "..."
}`}
                </code>
              </pre>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <span>Learn more</span>
              <ArrowRight size={16} />
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Code size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Setup the Route</h3>
            <p className="text-slate-600 mb-6">
              Create a dynamic route in your Next.js app. Our system will automatically 
              generate static pages for each keyword in your JSON file.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <pre className="text-sm text-slate-700 font-mono">
                <code>
{`// app/[slug]/page.tsx
export async function generateStaticParams() {
  return keywords.map(keyword => ({
    slug: keyword.slug
  }));
}`}
                </code>
              </pre>
            </div>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <span>Learn more</span>
              <ArrowRight size={16} />
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Globe size={32} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Deploy & Rank</h3>
            <p className="text-slate-600 mb-6">
              Deploy your app and watch your SEO rankings improve. Our static pages are 
              optimized for search engines and load lightning fast.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-slate-700">Static page generation</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-slate-700">SEO-optimized metadata</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-slate-700">Fast loading times</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-medium">
              <span>Learn more</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors active:scale-95 flex items-center gap-2 mx-auto">
            Get Started Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}