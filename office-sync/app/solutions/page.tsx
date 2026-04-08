'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, TrendingUp, Gamepad2, Shield, Clock, Server, Monitor, Mail, AlertCircle } from 'lucide-react';
import Fuse from 'fuse.js';
import keywords from '@/data/keywords.json';
import SolutionCard from '@/components/seo/SolutionCard';
import LivePreview from '@/components/seo/LivePreview';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 分类背景描述
const categoryDescriptions: Record<string, string> = {
  'Gaming in Office': `The modern office environment has become increasingly surveilled, with IT departments implementing sophisticated monitoring systems that track every keystroke and mouse movement. For professionals in open-plan offices, the pressure to maintain constant productivity has reached unprecedented levels. StealthPlay provides a crucial escape mechanism, allowing employees to take mental breaks without triggering suspicion. Our Excel-window disguise technology enables seamless gaming sessions that appear as legitimate spreadsheet work, protecting your privacy while maintaining professional appearances. In an era of increasing workplace surveillance, StealthPlay offers the perfect balance between productivity and personal well-being.`,
  
  'Anti-Monitoring': `Corporate surveillance has evolved beyond simple time-tracking to include sophisticated behavioral analysis and pattern recognition. Bossware applications like HubStaff, Teramind, and ActivTrak now monitor everything from application usage to eye movements. This constant surveillance creates a toxic work environment that destroys morale and creativity. StealthPlay's anti-monitoring technology operates at the system level, creating realistic activity patterns that satisfy monitoring algorithms while allowing you to enjoy personal time. Our AI-driven mouse simulator and keyboard pattern generator ensure that your gaming sessions remain undetected, even under the most intrusive surveillance systems.`,
  
  'Status Management': `The "Available" status indicator has become the digital equivalent of a time clock, with managers using Teams, Slack, and Discord presence as a proxy for productivity. Remote workers face constant pressure to maintain green status indicators, leading to burnout and anxiety. StealthPlay's status management technology automatically maintains your "Active" status across all major collaboration platforms, sending periodic signals that mimic natural user activity. Whether you're in a three-hour raid or taking a well-deserved break, our virtual driver ensures your status remains green without requiring physical presence at your keyboard.`,
  
  'Network Bypass': `Enterprise firewalls and content filters have become increasingly sophisticated, blocking gaming traffic and flagging suspicious network activity. IT departments implement deep packet inspection and SSL interception to monitor all network communications. StealthPlay's network bypass technology encrypts gaming traffic to appear as legitimate business communications, using the same protocols and port numbers as common enterprise applications. Our advanced packet masking ensures that your gaming sessions remain invisible to network monitoring tools, allowing you to bypass even the most restrictive corporate firewalls without detection.`,
  
  'Productivity Theater': `The modern workplace demands not just productivity, but the appearance of constant productivity. Employees are expected to maintain visible activity even during natural downtime, creating a culture of "productivity theater" where looking busy is more important than actual output. StealthPlay enables you to maintain the appearance of focused work while enjoying personal time. Our technology generates realistic work patterns, from document editing to spreadsheet navigation, ensuring that your screen always displays professional content even when you're mentally elsewhere. Reclaim your time without sacrificing your professional reputation.`
};

// 动态占位符
const placeholders = [
  'Try searching "Excel stealth"',
  'Try "VS Code skin"',
  'Try "Bypass Teams Away"',
  'Try "Hubstaff bypass"',
  'Try "Gaming in office"',
  'Try "Status management"'
];

// 分类逻辑
function categorizeSolutions(solutions: any[]) {
  const categories: Record<string, any[]> = {
    'Gaming in Office': [],
    'Anti-Monitoring': [],
    'Status Management': [],
    'Network Bypass': [],
    'Productivity Theater': []
  };

  solutions.forEach(solution => {
    const { keyword, title } = solution;
    const text = `${keyword} ${title}`.toLowerCase();

    if (text.includes('game') || text.includes('excel') || text.includes('office')) {
      categories['Gaming in Office'].push(solution);
    } else if (text.includes('track') || text.includes('monitor') || text.includes('boss') || text.includes('spy')) {
      categories['Anti-Monitoring'].push(solution);
    } else if (text.includes('status') || text.includes('active') || text.includes('away')) {
      categories['Status Management'].push(solution);
    } else if (text.includes('bypass') || text.includes('block') || text.includes('network') || text.includes('firewall')) {
      categories['Network Bypass'].push(solution);
    } else {
      categories['Productivity Theater'].push(solution);
    }
  });

  return categories;
}

// 分类图标映射
const categoryIcons = {
  'Gaming in Office': <Gamepad2 className="w-5 h-5 text-slate-400" />,
  'Anti-Monitoring': <Shield className="w-5 h-5 text-slate-400" />,
  'Status Management': <Clock className="w-5 h-5 text-slate-400" />,
  'Network Bypass': <Server className="w-5 h-5 text-slate-400" />,
  'Productivity Theater': <Monitor className="w-5 h-5 text-slate-400" />
};

// 获取 Trending Solutions
function getTrendingSolutions(solutions: any[], count: number = 5) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  const shuffled = [...solutions].sort((a, b) => {
    const hashA = a.slug.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), seed);
    const hashB = b.slug.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), seed);
    return hashA - hashB;
  });
  
  return shuffled.slice(0, count);
}

export default function SolutionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [filteredSolutions, setFilteredSolutions] = useState<any[]>([]);
  const [categorizedSolutions, setCategorizedSolutions] = useState<Record<string, any[]>>({});
  const [trendingSolutions, setTrendingSolutions] = useState<any[]>([]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  const fuseRef = useRef<Fuse<any> | null>(null);

  // 初始化 Fuse.js
  useEffect(() => {
    fuseRef.current = new Fuse(keywords, {
      keys: [
        'title',
        'keyword',
        'problem_description',
        'persona',
        'industry_context',
        'technical_hurdle',
        'related_tools'
      ],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
      findAllMatches: true
    });
  }, []);

  // 初始化分类
  useEffect(() => {
    const categories = categorizeSolutions(keywords);
    setCategorizedSolutions(categories);
    setExpandedCategories(Object.keys(categories).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {} as Record<string, boolean>));
    
    // 设置 Trending Solutions
    setTrendingSolutions(getTrendingSolutions(keywords, 5));
  }, []);

  // 动态占位符循环
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 处理搜索
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSolutions([]);
      setShowEmailForm(false);
    } else if (fuseRef.current) {
      const results = fuseRef.current.search(searchTerm);
      const filtered = results.map(result => result.item);
      setFilteredSolutions(filtered);
      setShowEmailForm(filtered.length === 0);
    }
  }, [searchTerm]);

  // 切换分类展开/折叠
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 处理 Email 提交
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // 这里可以集成 Supabase 或其他后端服务
    // 暂时使用 console.log 模拟
    console.log('Email submitted:', email, 'Search term:', searchTerm);
    
    // 模拟 API 调用
    setEmailSubmitted(true);
    setTimeout(() => {
      setShowEmailForm(false);
      setEmailSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={placeholders[currentPlaceholder]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { label: 'Solutions' }
          ]}
        />

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            Stealth Gaming Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Discover 100+ expert strategies to enjoy gaming during work hours without getting caught. From Excel window disguises to anti-monitoring tools, we've got you covered.
          </p>
        </header>

        {/* Live Preview */}
        <LivePreview />

        {/* Trending Solutions */}
        {searchTerm.trim() === '' && trendingSolutions.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-slate-900">Trending Solutions Today</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingSolutions.slice(0, 3).map((solution) => (
                <SolutionCard
                  key={solution.slug}
                  title={solution.title}
                  description={solution.problem_description}
                  slug={solution.slug}
                  persona={solution.persona}
                  industry={solution.industry_context}
                  variant="featured"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {trendingSolutions.slice(3, 5).map((solution) => (
                <SolutionCard
                  key={solution.slug}
                  title={solution.title}
                  description={solution.problem_description}
                  slug={solution.slug}
                  persona={solution.persona}
                  industry={solution.industry_context}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )}

        {/* Search Results */}
        {searchTerm.trim() !== '' && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              Search Results ({filteredSolutions.length})
            </h2>
            
            {filteredSolutions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.slug}
                    title={solution.title}
                    description={solution.problem_description}
                    slug={solution.slug}
                    persona={solution.persona}
                    industry={solution.industry_context}
                  />
                ))}
              </div>
            ) : showEmailForm && !emailSubmitted ? (
              <div className="bg-white border border-slate-200 p-8 rounded-md">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
                  <h3 className="text-xl font-bold text-slate-900">No Results Found</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  We couldn't find any solutions matching "{searchTerm}". Let us know what you're looking for, and we'll create a solution for your industry!
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                      Request Industry
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">
                    We'll notify you when we create a solution for "{searchTerm}"
                  </p>
                </form>
              </div>
            ) : emailSubmitted ? (
              <div className="bg-green-50 border border-green-200 p-8 rounded-md">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-900">Thank You!</h3>
                </div>
                <p className="text-green-700">
                  We've received your request for "{searchTerm}". We'll notify you at {email} when we create a solution for your industry.
                </p>
              </div>
            ) : null}
          </section>
        )}

        {/* Category Sections */}
        {searchTerm.trim() === '' && Object.entries(categorizedSolutions).map(([category, solutions]) => (
          <section key={category} className="mb-16">
            <div 
              className="flex items-center justify-between cursor-pointer mb-6"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-2xl font-bold text-slate-900 flex items-center border-l-4 border-blue-500 pl-4">
                {categoryIcons[category as keyof typeof categoryIcons]}
                <span className="ml-3">{category} ({solutions.length})</span>
              </h2>
              {expandedCategories[category] ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {expandedCategories[category] && (
              <>
                {/* Category Description */}
                <div className="bg-white border border-slate-200 p-8 rounded-md mb-6">
                  <p className="text-slate-600 leading-relaxed">
                    {categoryDescriptions[category]}
                  </p>
                </div>

                {/* Solutions Grid */}
                {solutions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutions.map((solution) => (
                      <SolutionCard
                        key={solution.slug}
                        title={solution.title}
                        description={solution.problem_description}
                        slug={solution.slug}
                        persona={solution.persona}
                        industry={solution.industry_context}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">StealthPlay</h2>
            <p className="text-slate-400 mb-8">The ultimate guide to gaming at work without getting caught</p>
            <div className="mb-4">
              <Link href="/sitemap" className="text-slate-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
            <p className="text-slate-400">
              Support: <a href="mailto:457239850@qq.com" className="text-blue-400 hover:text-blue-300">457239850@qq.com</a>
            </p>
          </div>
        </div>
      </footer>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Stealth Gaming Solutions',
            'description': '100+ expert strategies to enjoy gaming during work hours without getting caught',
            'itemListElement': keywords.map((solution, index) => ({
              '@type': 'ListItem',
              'position': index + 1,
              'url': `/solutions/${solution.slug}`,
              'name': solution.title
            }))
          })
        }}
      />
    </div>
  );
}
