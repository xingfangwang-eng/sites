'use client';

import React from 'react';
import keywords from '@/data/keywords.json';

interface SmartInterlinksProps {
  currentSlug: string;
  relatedTools: string[];
  industryContext: string;
  persona: string;
}

export function SmartInterlinks({ currentSlug, relatedTools, industryContext, persona }: SmartInterlinksProps) {
  // 生成相关链接的函数
  function generateRelatedLinks() {
    // 过滤掉当前页面
    const otherKeywords = keywords.filter((item) => item.slug !== currentSlug);
    
    // 计算每个页面的相关度分数
    const scoredKeywords = otherKeywords.map((keyword) => {
      let score = 0;
      
      // 根据相关工具计算分数
      relatedTools.forEach((tool) => {
        if (keyword.related_tools.includes(tool)) {
          score += 3;
        }
      });
      
      // 根据行业背景计算分数
      if (keyword.industry_context === industryContext) {
        score += 2;
      }
      
      // 根据用户画像计算分数
      if (keyword.persona === persona) {
        score += 1;
      }
      
      return { ...keyword, score };
    });
    
    // 按分数排序并选择前3个
    const sortedKeywords = scoredKeywords.sort((a, b) => b.score - a.score);
    return sortedKeywords.slice(0, 3);
  }
  
  // 生成动态锚文本的函数
  function generateAnchorText(keyword: any) {
    const templates = [
      `Are you a ${persona}? Check our ${keyword.title}`,
      `Looking for solutions in ${industryContext}? Explore ${keyword.title}`,
      `Need help with ${keyword.technical_hurdle}? Try ${keyword.title}`,
      `As a ${persona} in ${industryContext}, you might like ${keyword.title}`,
      `Want to learn more about ${keyword.keyword}? Read our guide`
    ];
    
    const seed = (currentSlug + keyword.slug).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return templates[seed % templates.length];
  }
  
  const relatedLinks = generateRelatedLinks();
  
  if (relatedLinks.length === 0) {
    return null;
  }
  
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Solutions</h2>
        <div className="space-y-6">
          {relatedLinks.map((keyword, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6 rounded-md hover:shadow-md transition-shadow">
              <a 
                href={`/solutions/${keyword.slug}`} 
                className="block group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {generateAnchorText(keyword)}
                </h3>
                <p className="text-gray-600">
                  {keyword.problem_description} {keyword.how_to_solve.substring(0, 100)}...
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
