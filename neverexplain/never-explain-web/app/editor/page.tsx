"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedHook, setSavedHook] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const data = await response.json();
        setSavedHook(data.hook);
        alert(`Context saved successfully! Hook: ${data.hook}`);
        // 清空表单
        setTitle("");
        setContent("");
      } else {
        const error = await response.json();
        alert(`Error saving context: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving context:", error);
      alert("An error occurred while saving the context");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </header>

        <main>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Create New Context
          </h1>

          {savedHook && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-800 dark:text-green-300">
                Context saved successfully! Hook: <code className="font-mono bg-green-100 dark:bg-green-800/50 px-2 py-1 rounded">{savedHook}</code>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                placeholder="Enter a title for your context"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 min-h-[300px]"
                placeholder="Enter your context content here..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : (
                  <>
                    <Save size={18} />
                    Save Context
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
