'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ExtractorInput from '../components/ExtractorInput';
import PersonaDilutionCalculator from '../components/PersonaDilutionCalculator';
import ComparisonTable from '../components/ComparisonTable';
import Breadcrumbs from '../components/Breadcrumbs';
import YouMayAlsoLike from '../components/YouMayAlsoLike';

interface LayoutDProps {
  keyword: any;
  codeExample: string;
  shuffledSections?: string[];
  headingStyle?: 'plain' | 'icon';
  injectedContent?: React.ReactNode;
  ctaButtonText?: string;
  relatedLinks?: any[];
  deepContent?: any;
}

export default function Layout_D({ 
  keyword, 
  codeExample, 
  shuffledSections = ['problem', 'tool', 'guide', 'code'],
  headingStyle = 'plain',
  injectedContent,
  ctaButtonText = 'Analyze & Extract',
  relatedLinks = [],
  deepContent
}: LayoutDProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  const handleExtract = () => {
    setIsExtracting(true);
    setExtractionProgress(0);
    
    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsExtracting(false);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // 渲染单个模块
  const renderSection = (section: string) => {
    switch (section) {
      case 'problem':
        return (
          <section key="problem" className="mb-16">
            <p className="text-xl leading-relaxed text-slate-600 mb-8">
              {keyword.problem_description}
            </p>
            <p className="text-xl leading-relaxed text-slate-600">
              This issue affects developers of all skill levels, from beginners to experienced professionals. Without the right tools and knowledge, it can lead to wasted time, security vulnerabilities, and suboptimal performance.
            </p>
          </section>
        );
      case 'tool':
        return (
          <section key="tool" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              The Tool
            </h2>
            <ExtractorInput 
              rounded="rounded-lg" 
              spacing="p-8"
              buttonText={ctaButtonText}
            />
          </section>
        );
      case 'guide':
        return (
          <section key="guide" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              The Guide
            </h2>
            <div className="text-xl leading-relaxed text-slate-600">
              <p className="mb-4">
                Our approach is designed to be accessible to developers of all skill levels, while providing professional-grade results. We combine best practices with practical implementation to ensure your solution is both effective and maintainable.
              </p>
              <p className="mb-4">
                Here's how our process works:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Input your code or command</li>
                <li>Our tool analyzes the input</li>
                <li>We generate optimized code or solutions</li>
                <li>You implement the solution</li>
              </ol>
            </div>
          </section>
        );
      case 'code':
        return (
          <section key="code">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              Code Example
            </h2>
            <div className="bg-slate-50 p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm font-mono text-slate-800">{codeExample}</pre>
            </div>
          </section>
        );
      case 'intro':
        return (
          <section key="intro" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              Introduction
            </h2>
            <div className="text-xl leading-relaxed text-slate-600">
              <p>{deepContent?.intro}</p>
            </div>
          </section>
        );
      case 'linguistic':
        return (
          <section key="linguistic" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              Linguistic Analysis
            </h2>
            <div className="text-lg leading-relaxed text-slate-700">
              <p>{deepContent?.linguisticAnalysis}</p>
            </div>
          </section>
        );
      case 'prediction':
        return (
          <section key="prediction" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              The 2026 Prediction
            </h2>
            <div className="text-lg leading-relaxed text-slate-700">
              <p>{deepContent?.prediction2026}</p>
            </div>
          </section>
        );
      case 'ai-smell':
        return (
          <section key="ai-smell" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              AI Smell Index Table
            </h2>
            <ComparisonTable templateType={keyword.template_type} />
          </section>
        );
      case 'calculator':
        return (
          <section key="calculator" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              Persona Dilution Calculator
            </h2>
            <PersonaDilutionCalculator />
          </section>
        );
      case 'implementation':
        return (
          <section key="implementation" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              3-Step Extraction Guide
            </h2>
            <div className="text-xl leading-relaxed text-slate-600">
              <p>{deepContent?.implementationGuide}</p>
            </div>
          </section>
        );
      case 'faq':
        return (
          <section key="faq" className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              SEO FAQ
            </h2>
            <div className="text-xl leading-relaxed text-slate-600">
              {deepContent?.seoFaq?.questions?.map((faq: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="font-bold text-slate-900 mb-3">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Main content */}
      <div className="max-w-4xl mx-auto my-16 px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs keyword={keyword} />
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-slate-900 mb-8">
            {keyword.title}
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
        </div>

        {/* DNA Extraction Simulation */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
            DNA Extraction
          </h2>
          
          <div className="bg-slate-50 border border-slate-200 p-10 rounded-lg mb-8">
            {isExtracting ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-slate-600 mb-4">Extracting Style DNA...</p>
                  <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-600 h-full transition-all duration-300 ease-in-out"
                      style={{ width: `${extractionProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{extractionProgress}%</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-red-600/10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                          DNA
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg text-slate-600 mb-8 text-center">
                  {keyword.how_to_solve}
                </p>
                <button 
                  className="w-full bg-red-600 text-white py-4 font-medium hover:bg-red-700 transition-colors rounded-lg"
                  onClick={handleExtract}
                >
                  Extract DNA
                </button>
              </>
            )}
          </div>
        </section>

        {/* 动态渲染模块 */}
        {shuffledSections.map((section, index) => {
          // 在第二个模块后插入额外内容
          if (index === 1 && injectedContent) {
            return (
              <React.Fragment key={`section-${section}`}>
                {renderSection(section)}
                <div className="mb-16">
                  {injectedContent}
                </div>
              </React.Fragment>
            );
          }
          return renderSection(section);
        })}

        {/* Related Styles */}
        {relatedLinks.length > 0 && (
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-light text-slate-900 mb-8 text-center">
              Related Styles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedLinks.map((link) => (
                <a 
                  key={link.slug} 
                  href={`/${link.slug}`} 
                  className="bg-slate-50 border border-slate-200 p-6 rounded-lg hover:border-red-600 transition-colors"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{link.title}</h3>
                  <p className="text-sm text-slate-600">{link.how_to_solve.substring(0, 100)}...</p>
                </a>
              ))}
            </div>
          </section>
        )}
        
        {/* You May Also Like - Power Tools */}
        <YouMayAlsoLike />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="text-center space-y-1">
            <p className="text-slate-500 text-sm">
              © 2026 PersonaLock. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm">
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
