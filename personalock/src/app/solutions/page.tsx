'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Code, Shield, Server, Zap, Database, Home, Sparkles, TrendingUp, Users } from 'lucide-react';
import Fuse from 'fuse.js';

interface Keyword {
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
  template_type?: string;
  seed?: number;
  weight?: number;
  usageCount?: number;
}

// 读取 keywords 数据
import keywordsData from '../../../data/keywords.json';

// 分类映射
const CATEGORIES = [
  {
    id: 'api',
    name: 'API Integration',
    description: 'Master the art of seamless API integration in your applications. This category covers everything from curl to Axios conversions, RESTful API best practices, and authentication methods. Essential for modern web developers building connected applications.',
    keywords: ['api', 'axios', 'curl', 'fetch', 'request'],
    icon: <Code className="w-5 h-5 text-slate-400" />,
    tags: ['API', 'REST', 'Integration']
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Secure your applications with industry-best practices. From API key management to JWT authentication, this category provides comprehensive guides to protect your data and users. Critical for maintaining trust and compliance in production environments.',
    keywords: ['secure', 'authentication', 'jwt', 'token', 'password', 'credential'],
    icon: <Shield className="w-5 h-5 text-slate-400" />,
    tags: ['Security', 'Auth', 'Best Practices']
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    description: 'Speed up your applications and deliver exceptional user experiences. This category focuses on React performance tuning, bundle optimization, and rendering efficiency. Learn proven techniques to reduce load times and improve core web vitals.',
    keywords: ['optimize', 'performance', 'speed', 'load', 'render'],
    icon: <Zap className="w-5 h-5 text-slate-400" />,
    tags: ['Performance', 'Optimization', 'React']
  },
  {
    id: 'deployment',
    name: 'Deployment & DevOps',
    description: 'Streamline your deployment workflow with modern DevOps practices. From Docker containerization to CI/CD pipelines, this category helps you automate and scale your operations efficiently. Essential for teams looking to ship faster with confidence.',
    keywords: ['docker', 'deploy', 'container', 'devops', 'ci/cd'],
    icon: <Server className="w-5 h-5 text-slate-400" />,
    tags: ['DevOps', 'Docker', 'Deployment']
  },
  {
    id: 'database',
    name: 'Database & Storage',
    description: 'Master database management and storage solutions for modern applications. This category covers everything from SQL to NoSQL, data modeling, and efficient storage strategies. Critical for building scalable and reliable data systems.',
    keywords: ['database', 'mongodb', 'postgres', 'sql', 'storage', 'redis'],
    icon: <Database className="w-5 h-5 text-slate-400" />,
    tags: ['Database', 'Storage', 'SQL']
  }
];

// Trending Tags - 热门标签
const TRENDING_TAGS = [
  { name: 'No more "Delve"', slug: 'delve', description: 'Remove AI clichés' },
  { name: 'LinkedIn Humanizer', slug: 'linkedin', description: 'Professional tone' },
  { name: 'Twitter Thread Style', slug: 'twitter', description: 'Viral content' },
  { name: 'React Performance', slug: 'react-performance', description: 'Speed optimization' },
  { name: 'Docker Mastery', slug: 'docker', description: 'Containerization' },
  { name: 'JWT Security', slug: 'jwt', description: 'Authentication' },
  { name: 'API Integration', slug: 'api', description: 'Seamless connection' },
  { name: 'Code Optimization', slug: 'optimize', description: 'Performance boost' }
];

// 为关键词生成随机权重
const generateWeight = (keyword: Keyword) => {
  const hash = keyword.slug.split('').reduce((acc: number, char: string) => {
    return acc + char.charCodeAt(0);
  }, 0);
  return (hash % 100) / 100;
};

// 为关键词生成使用计数
const generateUsageCount = (keyword: Keyword) => {
  const hash = keyword.slug.split('').reduce((acc: number, char: string) => {
    return acc + char.charCodeAt(0);
  }, 0);
  const base = 800 + (hash % 1200);
  return base;
};

// 格式化使用计数
const formatUsageCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`;
  }
  return `${count}+`;
};

// 为每个关键词生成标签
const getKeywordTags = (keyword: Keyword, category: any) => {
  const tags = [];
  tags.push(category.tags[0]);
  if (keyword.slug.includes('react')) tags.push('React');
  if (keyword.slug.includes('node')) tags.push('Node.js');
  if (keyword.slug.includes('docker')) tags.push('Docker');
  return tags.slice(0, 2);
};

// 分类函数
const categorizeKeyword = (keyword: Keyword) => {
  const text = `${keyword.title.toLowerCase()} ${keyword.slug.toLowerCase()}`;
  
  for (const category of CATEGORIES) {
    if (category.keywords.some(keyword => text.includes(keyword))) {
      return category.id;
    }
  }
  
  return 'api';
};

// 高亮显示匹配文本
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.split(' ').join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase().match(new RegExp(`(${searchTerm.split(' ').join('|')})`, 'gi'))) {
      return <mark key={index} className="bg-yellow-200 text-slate-900 px-1 rounded">{part}</mark>;
    }
    return part;
  });
};

// 生成 JSON-LD Schema
const generateJsonLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Development Solutions',
    'numberOfItems': keywordsData.length,
    'itemListElement': keywordsData.map((keyword, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `/solutions/${keyword.slug}`
    }))
  };
};

// 面包屑导航组件
const Breadcrumbs = ({ currentCategory }: { currentCategory?: string }) => {
  return (
    <nav className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-slate-600">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>
        <li className="text-slate-400">/</li>
        <li>
          <Link href="/solutions/" className="hover:text-blue-500 transition-colors">
            Solutions Library
          </Link>
        </li>
        {currentCategory && (
          <>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-medium">
              {CATEGORIES.find(c => c.id === currentCategory)?.name}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default function SolutionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    CATEGORIES.reduce((acc, category) => ({
      ...acc,
      [category.id]: true
    }), {})
  );
  
  // 配置 Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(keywordsData, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'problem_description', weight: 0.3 },
        { name: 'slug', weight: 0.2 },
        { name: 'how_to_solve', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true
    });
  }, []);
  
  // 使用 Fuse.js 进行搜索并按权重排序
  const filteredKeywords = useMemo(() => {
    let results = keywordsData;
    
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm);
      results = searchResults.map(result => result.item);
    }
    
    // 添加权重并排序
    return results
      .map(keyword => ({
        ...keyword,
        weight: generateWeight(keyword),
        usageCount: generateUsageCount(keyword)
      }))
      .sort((a, b) => b.weight - a.weight);
  }, [searchTerm, fuse]);
  
  // 过滤后的分类数据
  const filteredCategorizedKeywords = useMemo(() => {
    return filteredKeywords.reduce((acc: Record<string, Keyword[]>, keyword) => {
      const category = categorizeKeyword(keyword);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(keyword);
      return acc;
    }, {});
  }, [filteredKeywords]);
  
  // 检查是否有搜索结果
  const hasResults = filteredKeywords.length > 0;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd()) }}
      />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto my-12 px-6 md:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
            Solutions Library
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Browse our comprehensive collection of development guides and solutions organized by category.
          </p>
        </div>
        
        {/* Trending Styles - Hot Tags */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Trending Styles</h2>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max">
              {TRENDING_TAGS.map((tag, index) => (
                <Link
                  key={index}
                  href={`/solutions/#${tag.slug}`}
                  className="flex-shrink-0 bg-white border border-slate-200 px-6 py-3 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tag.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{tag.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-10 bg-white border border-slate-200 p-4 mb-8">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search solutions... (e.g., 'docker', 'jwt', 'react performance')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                {filteredKeywords.length} result{filteredKeywords.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        
        {/* Categories */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map(category => (
              <Link
                key={category.id}
                href={`#${category.id}`}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                {category.icon}
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* No Results Message */}
        {!hasResults && searchTerm && (
          <div className="text-center py-16">
            <div className="bg-white border border-slate-200 p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                No results found for "{searchTerm}"
              </h2>
              <p className="text-slate-600 mb-8">
                We couldn't find any solutions matching your search. But don't worry! Let us help you create a custom solution tailored to your needs.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 font-medium hover:bg-blue-700 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Customize Your DNA
              </Link>
            </div>
          </div>
        )}
        
        {/* Solutions Grid */}
        {hasResults && (
          <div className="space-y-16">
            {CATEGORIES.map(category => {
              const categoryKeywords = filteredCategorizedKeywords[category.id] || [];
              if (categoryKeywords.length === 0) return null;
              
              return (
                <section key={category.id} id={category.id}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-4 h-12 bg-blue-500"></div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {category.name}
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({categoryKeywords.length} {categoryKeywords.length === 1 ? 'solution' : 'solutions'})
                    </span>
                    <button
                      onClick={() => setExpandedCategories(prev => ({
                        ...prev,
                        [category.id]: !prev[category.id]
                      }))}
                      className="ml-auto"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* 分类描述 */}
                  <div className="bg-white border border-slate-200 p-6 mb-6">
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {category.tags.map((tag, index) => (
                        <span key={index} className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {expandedCategories[category.id] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryKeywords.map((keyword: Keyword) => {
                        const tags = getKeywordTags(keyword, category);
                        const usageCount = keyword.usageCount || generateUsageCount(keyword);
                        return (
                          <article key={keyword.slug} className="bg-white border border-slate-200 p-8 hover:border-blue-500 transition-colors">
                            <Link href={`/${keyword.slug}/`}>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag, index) => (
                                  <span key={index} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-4 hover:text-blue-500 transition-colors">
                                {highlightText(keyword.title, searchTerm)}
                              </h3>
                              <p className="text-slate-600 leading-relaxed mb-4">
                                {highlightText(keyword.problem_description.substring(0, 120) + '...', searchTerm)}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Users className="w-4 h-4" />
                                <span>Used by {formatUsageCount(usageCount)} creators</span>
                              </div>
                            </Link>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="text-center space-y-1">
            <p className="text-slate-600">
              © 2026 PersonaLock. All rights reserved.
            </p>
            <p className="text-slate-600">
              Support: <a href="mailto:457239850@qq.com" className="text-blue-600 hover:underline">457239850@qq.com</a>
              {' · '}
              <Link href="/sitemap" className="text-blue-600 hover:underline">Sitemap</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
