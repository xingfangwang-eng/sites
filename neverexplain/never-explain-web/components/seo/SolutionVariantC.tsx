import { ArrowRight, Book, Code, Database, Globe, ChevronRight } from "lucide-react";

export default function SolutionVariantC() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Technical Documentation</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Comprehensive guide to implementing our programmatic SEO solution
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Book size={20} />
                Table of Contents
              </h3>
              <nav className="space-y-2">
                <a href="#overview" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2 border-b border-slate-100">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  Overview
                </a>
                <a href="#setup" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2 border-b border-slate-100">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  Setup & Installation
                </a>
                <a href="#data-structure" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2 border-b border-slate-100">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  Data Structure
                </a>
                <a href="#dynamic-routing" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2 border-b border-slate-100">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  Dynamic Routing
                </a>
                <a href="#metadata" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2 border-b border-slate-100">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  SEO Metadata
                </a>
                <a href="#deployment" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2 border-b border-slate-100">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  Deployment
                </a>
                <a href="#best-practices" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors py-2">
                  <ChevronRight size={16} className="flex-shrink-0" />
                  Best Practices
                </a>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              {/* Overview Section */}
              <section id="overview" className="mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Overview</h3>
                <p className="text-lg text-slate-600 mb-6">
                  Our programmatic SEO solution allows you to generate hundreds of SEO-friendly landing pages 
                  from a single data source. This approach saves time, ensures consistency, and improves 
                  search engine rankings.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Key Benefits</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
                      <span>Automated page generation</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
                      <span>SEO-optimized metadata</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
                      <span>Fast loading static pages</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
                      <span>Easy maintenance and updates</span>
                    </li>
                  </ul>
                </div>
              </section>
              
              {/* Setup Section */}
              <section id="setup" className="mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Setup & Installation</h3>
                <p className="text-lg text-slate-600 mb-6">
                  Getting started with our programmatic SEO solution is easy. Follow these steps to set up 
                  your project.
                </p>
                <div className="bg-slate-900 text-white rounded-lg p-6 mb-6">
                  <pre className="text-sm font-mono">
                    <code>
{`# Install dependencies
npm install next@latest react react-dom

# Create project structure
mkdir -p app/[slug] data

# Create keywords data file
touch data/keywords.json`}
                    </code>
                  </pre>
                </div>
              </section>
              
              {/* Data Structure Section */}
              <section id="data-structure" className="mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Data Structure</h3>
                <p className="text-lg text-slate-600 mb-6">
                  The keywords.json file contains the data used to generate your landing pages. Each entry 
                  represents a single page with its own slug, title, and content.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                  <pre className="text-sm font-mono text-slate-800">
                    <code>
{`[
  {
    "slug": "convert-curl-to-axios",
    "title": "How to Convert cURL to Axios: A Step-by-Step Guide",
    "problem_description": "Developers often need to convert cURL commands to Axios requests...",
    "how_to_solve": "Our tool automatically converts any cURL command to a properly formatted Axios request..."
  },
  // More entries...
]`}
                    </code>
                  </pre>
                </div>
              </section>
              
              {/* Dynamic Routing Section */}
              <section id="dynamic-routing" className="mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Dynamic Routing</h3>
                <p className="text-lg text-slate-600 mb-6">
                  Next.js dynamic routes allow us to generate static pages for each entry in our keywords.json file.
                </p>
                <div className="bg-slate-900 text-white rounded-lg p-6 mb-6">
                  <pre className="text-sm font-mono">
                    <code>
{`// app/[slug]/page.tsx
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
              </section>
              
              {/* Deployment Section */}
              <section id="deployment" className="mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Deployment</h3>
                <p className="text-lg text-slate-600 mb-6">
                  Once your project is set up, deploy it to your favorite hosting provider.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Deployment Steps</h4>
                  <ol className="space-y-2 list-decimal list-inside text-slate-700">
                    <li>Build your project: <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm">npm run build</code></li>
                    <li>Test your build: <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm">npm run start</code></li>
                    <li>Deploy to Vercel, Netlify, or your preferred hosting provider</li>
                  </ol>
                </div>
              </section>
              
              {/* Call to Action */}
              <div className="mt-16 text-center">
                <button className="px-8 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors active:scale-95 flex items-center gap-2 mx-auto">
                  View Full Documentation
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}