import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface BreadcrumbsProps {
  keyword?: any;
  className?: string;
}

const CATEGORIES = [
  { id: 'api', name: 'API Integration', keywords: ['api', 'axios', 'curl', 'fetch', 'request'] },
  { id: 'security', name: 'Security', keywords: ['secure', 'authentication', 'jwt', 'token', 'password', 'credential'] },
  { id: 'performance', name: 'Performance Optimization', keywords: ['optimize', 'performance', 'speed', 'load', 'render'] },
  { id: 'deployment', name: 'Deployment & DevOps', keywords: ['docker', 'deploy', 'container', 'devops', 'ci/cd'] },
  { id: 'database', name: 'Database & Storage', keywords: ['database', 'mongodb', 'postgres', 'sql', 'storage', 'redis'] }
];

const getCategory = (keyword: any) => {
  if (!keyword) return null;
  const text = `${keyword.title.toLowerCase()} ${keyword.slug.toLowerCase()}`;
  for (const category of CATEGORIES) {
    if (category.keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  return CATEGORIES[0];
};

export default function Breadcrumbs({ keyword, className = '' }: BreadcrumbsProps) {
  const category = keyword ? getCategory(keyword) : null;

  return (
    <nav className={`mb-8 ${className}`}>
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
        {category && (
          <>
            <li className="text-slate-400">/</li>
            <li>
              <Link href={`/solutions/#${category.id}`} className="hover:text-blue-500 transition-colors">
                {category.name}
              </Link>
            </li>
          </>
        )}
        {keyword && (
          <>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-medium">
              {keyword.title}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
