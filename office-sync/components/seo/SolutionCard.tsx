'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, TrendingUp, Gamepad2, Clock, Server, Monitor, Lock } from 'lucide-react';

interface SolutionCardProps {
  title: string;
  description: string;
  slug: string;
  persona?: string;
  industry?: string;
  securityScore?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const iconMap: Record<string, React.ReactNode> = {
  'Gaming in Office': <Gamepad2 className="w-5 h-5" />,
  'Anti-Monitoring': <Shield className="w-5 h-5" />,
  'Status Management': <Clock className="w-5 h-5" />,
  'Network Bypass': <Server className="w-5 h-5" />,
  'Productivity Theater': <Monitor className="w-5 h-5" />,
  'default': <Lock className="w-5 h-5" />
};

function getIcon(title: string): React.ReactNode {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('game') || lowerTitle.includes('excel') || lowerTitle.includes('office')) {
    return iconMap['Gaming in Office'];
  } else if (lowerTitle.includes('track') || lowerTitle.includes('monitor') || lowerTitle.includes('boss') || lowerTitle.includes('spy')) {
    return iconMap['Anti-Monitoring'];
  } else if (lowerTitle.includes('status') || lowerTitle.includes('active') || lowerTitle.includes('away')) {
    return iconMap['Status Management'];
  } else if (lowerTitle.includes('bypass') || lowerTitle.includes('block') || lowerTitle.includes('network') || lowerTitle.includes('firewall')) {
    return iconMap['Network Bypass'];
  } else {
    return iconMap['Productivity Theater'];
  }
}

function getSecurityScore(title: string): number {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 70 + (hash % 30);
}

function getSecurityColor(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 80) return 'text-blue-600 bg-blue-50';
  if (score >= 70) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

export default function SolutionCard({ 
  title, 
  description, 
  slug, 
  persona, 
  industry, 
  securityScore,
  variant = 'default' 
}: SolutionCardProps) {
  const icon = getIcon(title);
  const score = securityScore || getSecurityScore(title);
  const securityColor = getSecurityColor(score);

  if (variant === 'featured') {
    return (
      <article className="bg-white border-2 border-blue-500 p-8 rounded-md hover:shadow-lg transition-all">
        <Link href={`/solutions/${slug}`} className="block">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                {icon}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-xs font-medium text-orange-500 uppercase">Trending</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${securityColor}`}>
              {score}% Safe
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
          
          {persona && (
            <div className="text-sm text-slate-500 mb-4">
              <span className="font-medium">Perfect for:</span> {persona}
            </div>
          )}
          
          <div className="flex items-center text-blue-600 font-medium">
            View Solution
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="bg-white border border-slate-200 p-6 rounded-md hover:border-blue-500 transition-colors">
        <Link href={`/solutions/${slug}`} className="block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
              {icon}
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${securityColor}`}>
              {score}%
            </div>
          </div>
          
          <h3 className="text-base font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-sm text-slate-600 line-clamp-2">
            {description}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className="bg-white border border-slate-200 p-8 rounded-md hover:border-blue-500 transition-colors">
      <Link href={`/solutions/${slug}`} className="block">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
            {icon}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${securityColor}`}>
            {score}% Safe
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        {persona && (
          <div className="text-sm text-slate-500 mb-4">
            <span className="font-medium">Perfect for:</span> {persona}
          </div>
        )}
        
        <div className="flex items-center text-blue-600 font-medium">
          Learn More
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </article>
  );
}
