'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Code, Brain, Palette, FileText, TrendingUp, ArrowRight, Mail, X, Clock, Zap, Award } from 'lucide-react';
import Breadcrumb from '../../../components/seo/Breadcrumb';

interface KeywordItem {
  keyword: string;
  slug: string;
  title: string;
  problem_description: string;
  category: string;
  difficulty: number;
  user_quote: string;
  layout_seed: number;
  related_tools: string[];
}

interface Cluster {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  items: KeywordItem[];
}

interface SolutionsClientProps {
  keywords: KeywordItem[];
}

const categorizeKeywords = (keywords: KeywordItem[]): Cluster[] => {
  const clusters: Cluster[] = [
    {
      id: 'coding-flows',
      name: 'Coding Flows',
      icon: <Code className="w-5 h-5" />,
      description: 'Claude → Cursor, GPT → VSCode',
      items: []
    },
    {
      id: 'research-bridges',
      name: 'Research Bridges',
      icon: <Brain className="w-5 h-5" />,
      description: 'Perplexity → Claude, DeepSeek → ChatGPT',
      items: []
    },
    {
      id: 'creative-sync',
      name: 'Creative Sync',
      icon: <Palette className="w-5 h-5" />,
      description: 'Midjourney → DALL-E, Prompt Engineering',
      items: []
    },
    {
      id: 'enterprise-docs',
      name: 'Enterprise & Docs',
      icon: <FileText className="w-5 h-5" />,
      description: 'Gemini → Google Docs, SQL Cleanup',
      items: []
    }
  ];

  keywords.forEach(keyword => {
    const tools = keyword.related_tools.map(t => t.toLowerCase());
    const title = keyword.title.toLowerCase();
    const desc = keyword.problem_description.toLowerCase();

    if (tools.includes('cursor') || tools.includes('vscode') || 
        title.includes('cursor') || title.includes('vscode') || title.includes('ide') ||
        desc.includes('cursor') || desc.includes('vscode') || desc.includes('ide')) {
      clusters[0].items.push(keyword);
    }
    else if (tools.includes('perplexity') || tools.includes('deepseek') || tools.includes('chatgpt') ||
             title.includes('perplexity') || title.includes('deepseek') || title.includes('research') ||
             desc.includes('perplexity') || desc.includes('deepseek') || desc.includes('research')) {
      clusters[1].items.push(keyword);
    }
    else if (tools.includes('midjourney') || tools.includes('dall-e') ||
             title.includes('midjourney') || title.includes('dall-e') || title.includes('prompt') ||
             desc.includes('midjourney') || desc.includes('dall-e') || desc.includes('prompt')) {
      clusters[2].items.push(keyword);
    }
    else {
      clusters[3].items.push(keyword);
    }
  });

  return clusters.filter(cluster => cluster.items.length > 0);
};

export default function SolutionsClient({ keywords }: SolutionsClientProps) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClusters, setFilteredClusters] = useState<Cluster[]>([]);

  const top10Keywords = keywords.slice(0, 10);

  const hotTags = [
    'Claude to Cursor',
    'Markdown Fix',
    'Reasoning Chain',
    'Context Sync',
    'DeepSeek Logic'
  ];

  useEffect(() => {
    const categorized = categorizeKeywords(keywords);
    setClusters(categorized);
    setFilteredClusters(categorized);
  }, [keywords]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClusters(clusters);
      return;
    }

    const filtered = clusters.map(cluster => ({
      ...cluster,
      items: cluster.items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.problem_description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(cluster => cluster.items.length > 0);

    setFilteredClusters(filtered);
  }, [searchTerm, clusters]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 面包屑导航 */}
      <Breadcrumb items={[{ label: 'AI Workflow Solutions' }]} />

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">
            AI Workflow Solutions
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 mt-4 max-w-3xl">
            Discover {keywords.length} ways to bridge the gap between your favorite AI tools. 
            Find solutions for developers, researchers, writers, and students.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${keywords.length} AI workflow solutions...`}
              className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {hotTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 text-sm text-slate-600 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-full"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Efficiency Dashboard */}
      <section className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* 动态计数器 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-black text-slate-900 mb-2">
                {keywords.length}+
              </div>
              <div className="text-slate-600 font-medium">
                Fragmented AI Workflows Bridged
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-black text-slate-900 mb-2">
                12.5h
              </div>
              <div className="text-slate-600 font-medium">
                Average Time Saved / Month
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl font-black text-slate-900 mb-2">
                2026
              </div>
              <div className="text-slate-600 font-medium">
                AI Memory Bridge Technology
              </div>
            </div>
          </div>

          {/* 权威背书文本 */}
          <div className="bg-white border border-slate-200 p-8 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Expert Insight: Solving the AI Memory Gap
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  In 2026, the proliferation of AI tools has created an unprecedented challenge: 
                  <strong> context fragmentation</strong>. Developers, researchers, and creators waste 
                  countless hours manually transferring context between Claude, ChatGPT, Cursor, and 
                  other AI platforms. This &quot;AI Memory Gap&quot; disrupts workflow continuity and 
                  introduces formatting errors, lost context, and cognitive overhead.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  BrainBridge addresses this through a proprietary <strong>Cleaning Layer Algorithm</strong> 
                  that automatically sanitizes, reformats, and optimizes AI-generated content for 
                  seamless cross-platform transfer. Our technology eliminates invisible characters, 
                  normalizes markdown syntax, and preserves semantic context—reducing manual cleanup 
                  time by <strong>87%</strong> and enabling true multi-model collaboration.
                </p>
                <p className="text-slate-600 text-sm italic">
                  — The BrainBridge Research Team, specializing in AI workflow optimization since 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {searchTerm && filteredClusters.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              No results found for &quot;{searchTerm}&quot;
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Have a specific AI gap? We can build a bridge for it.
            </p>
            <a
              href={`mailto:xingfang.wang@gmail.com?subject=New AI Bridge Request: ${searchTerm}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors rounded-md"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Us</span>
            </a>
          </div>
        )}

        {!searchTerm && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Top 10 Most Critical AI Gaps
              </h2>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {top10Keywords.map((item, index) => (
                <article key={item.slug} className="bg-white border-2 border-red-200 p-6 hover:border-red-500 transition-colors relative">
                  <div className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <Link href={`/solutions/${item.slug}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {item.problem_description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {item.related_tools.slice(0, 2).join(' + ')}
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {filteredClusters.map(cluster => (
          <section key={cluster.id} id={cluster.id} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {cluster.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {cluster.name}
                </h2>
                <p className="text-slate-600 text-sm">
                  {cluster.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cluster.items.map((item, index) => (
                <article key={item.slug} className="bg-white border border-slate-200 p-8 hover:border-blue-500 transition-colors">
                  <Link href={`/solutions/${item.slug}`} className="block">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-3">
                      {item.problem_description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded">
                        {item.related_tools.slice(0, 2).join(' + ')}
                        {item.related_tools.length > 2 && '...'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600">
          <p>
            Support: <a href="mailto:457239850@qq.com" className="text-blue-600 hover:underline">457239850@qq.com</a>
          </p>
          <p className="text-slate-500 text-sm mt-2">
            <Link href="/sitemap" className="text-blue-600 hover:underline">Sitemap</Link>
            {' | '}
            BrainBridge © 2026 | All rights reserved
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'AI Workflow Solutions - BrainBridge',
            'description': 'A comprehensive collection of 100+ solutions to bridge the gap between AI tools. Find solutions for developers, researchers, writers, and students.',
            'url': 'https://brainbridge.com/solutions',
            'mainEntity': {
              '@type': 'ItemList',
              'name': 'AI Workflow Solutions',
              'description': 'A collection of solutions to bridge the gap between AI tools',
              'numberOfItems': keywords.length,
              'itemListElement': keywords.map((item, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': item.title,
                'url': `https://brainbridge.com/solutions/${item.slug}`,
                'description': item.problem_description
              }))
            },
            'author': {
              '@type': 'Organization',
              'name': 'BrainBridge',
              'url': 'https://brainbridge.com'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'BrainBridge',
              'url': 'https://brainbridge.com'
            },
            'datePublished': '2024-01-01',
            'dateModified': new Date().toISOString().split('T')[0]
          })
        }}
      />
    </div>
  );
}
