"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Clock, Hash } from "lucide-react";

export default function Home() {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Context Dashboard
          </h1>
          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
          >
            <Plus size={18} />
            New Context
          </Link>
        </header>

        <main>
          {contexts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                No contexts saved yet
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
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
                  className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
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
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
        </main>
      </div>
    </div>
  );
}
