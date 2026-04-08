"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Clock, Hash } from "lucide-react";
import Footer from "@/components/Footer";
import keywords from "@/data/keywords.json";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getCoreKeywords(keywords: any[]): any[] {
  const shuffled = [...keywords].sort((a, b) => {
    const hashA = hashString(a.slug);
    const hashB = hashString(b.slug);
    return hashA - hashB;
  });
  return shuffled.slice(0, 15);
}

export default function Home() {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const coreKeywords = getCoreKeywords(keywords);

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const response = await fetch("/api/contexts");
        if (response.ok) {
          const data = await response.json();
          setContexts(data);
        }
      } catch (error) {
        console.error("Error fetching contexts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContexts();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="flex items-center justify-between mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Never Explain
          </h1>
          <Link
            href="/editor"
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors active:scale-95"
          >
            <Plus size={18} />
            New Context
          </Link>
        </header>

        {/* Browse All Alternatives Button */}
        <div className="mb-16">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors active:scale-95"
          >
            Browse All Alternatives
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-slate-200 p-8 rounded-md hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 bg-red-100 rounded-full inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600" aria-hidden="true">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Avoid Massive Fines
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Stay compliant with the EU AI Act and avoid fines up to €35M
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-md hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 bg-red-100 rounded-full inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Save Hours Every Month
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Generate compliance reports in seconds, not hours
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-md hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 bg-red-100 rounded-full inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600" aria-hidden="true">
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Ready-to-Copy Templates
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Use our pre-made templates for transparency statements and risk management plans
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-md hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 bg-red-100 rounded-full inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Available in 4 Languages
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                English, Spanish, French, and German support
              </p>
            </div>
          </div>
        </section>

        {/* Context Dashboard */}
        <section>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
            Context Dashboard
          </h2>
          {contexts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-md">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                No contexts saved yet
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors active:scale-95"
              >
                Create your first context
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {contexts.map((context) => (
                <div
                  key={context.id}
                  className="p-6 bg-white border border-slate-200 rounded-md hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {context.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <Clock size={14} />
                      <span>
                        {new Date(context.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <Hash size={14} />
                    <code 
                      className="cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(context.hook);
                        // 显示复制成功提示
                        const element = document.createElement('div');
                        element.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md text-sm';
                        element.textContent = 'Copied to clipboard!';
                        document.body.appendChild(element);
                        setTimeout(() => {
                          element.remove();
                        }, 2000);
                      }}
                    >
                      {context.hook} (click to copy)
                    </code>
                  </div>
                  <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {context.content.substring(0, 150)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access 文字矩阵区域 */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {coreKeywords.map((keyword) => (
              <Link
                key={keyword.slug}
                href={`/solutions/${keyword.slug}`}
                className="text-sm text-zinc-500 hover:text-red-600 transition-colors"
              >
                {keyword.title}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
