import React from 'react';
import Link from 'next/link';
import ExtractorInput from '../components/ExtractorInput';
import PersonaDilutionCalculator from '../components/PersonaDilutionCalculator';
import ComparisonTable from '../components/ComparisonTable';
import Breadcrumbs from '../components/Breadcrumbs';
import YouMayAlsoLike from '../components/YouMayAlsoLike';

interface LayoutAProps {
  keyword: any;
  codeExample: string;
  shuffledSections?: string[];
  headingStyle?: 'plain' | 'icon';
  injectedContent?: React.ReactNode;
  ctaButtonText?: string;
  relatedLinks?: any[];
  deepContent?: any;
}

export default function Layout_A({ 
  keyword, 
  codeExample, 
  shuffledSections = ['problem', 'tool', 'guide', 'code'],
  headingStyle = 'plain',
  injectedContent,
  ctaButtonText = 'Analyze & Extract',
  relatedLinks = [],
  deepContent
}: LayoutAProps) {
  // 渲染单个模块
  const renderSection = (section: string) => {
    switch (section) {
      case 'problem':
        return (
          <section key="problem" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>The Problem</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              <p className="mb-4">
                {keyword.problem_description}
              </p>
              <p className="mb-4">
                This issue affects developers of all skill levels, from beginners to experienced professionals. Without the right tools and knowledge, it can lead to wasted time, security vulnerabilities, and suboptimal performance.
              </p>
              <p className="mb-4">
                Many developers spend hours manually converting code, researching best practices, or debugging issues that could be easily resolved with the right approach.
              </p>
              {deepContent?.seoCompletion && (
                <p className="mt-4">
                  {deepContent.seoCompletion}
                </p>
              )}
            </div>
          </section>
        );
      case 'tool':
        return (
          <section key="tool" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>The Tool</span>
            </h2>
            <div className={headingStyle === 'icon' ? 'pl-8' : ''}>
              <ExtractorInput 
                rounded="rounded-sm" 
                spacing="p-8"
                buttonText={ctaButtonText}
              />
            </div>
          </section>
        );
      case 'guide':
        return (
          <section key="guide" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>The Guide</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              <p className="mb-4">
                {keyword.how_to_solve}
              </p>
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
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>Code Example</span>
            </h2>
            <div className={headingStyle === 'icon' ? 'pl-8' : ''}>
              <div className="bg-slate-900 text-white p-6 rounded-sm overflow-x-auto border border-slate-700">
                <pre className="text-sm font-mono">{codeExample}</pre>
              </div>
            </div>
          </section>
        );
      case 'intro':
        return (
          <section key="intro" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>Introduction</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              <p>{deepContent?.intro}</p>
            </div>
          </section>
        );
      case 'linguistic':
        return (
          <section key="linguistic" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>Linguistic Analysis</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              <p>{deepContent?.linguisticAnalysis}</p>
            </div>
          </section>
        );
      case 'prediction':
        return (
          <section key="prediction" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>The 2026 Prediction</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              <p>{deepContent?.prediction2026}</p>
            </div>
          </section>
        );
      case 'ai-smell':
        return (
          <section key="ai-smell" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>AI Smell Index Table</span>
            </h2>
            <div className={headingStyle === 'icon' ? 'pl-8' : ''}>
              <ComparisonTable templateType={keyword.template_type} />
            </div>
          </section>
        );
      case 'calculator':
        return (
          <section key="calculator" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>Persona Dilution Calculator</span>
            </h2>
            <div className={headingStyle === 'icon' ? 'pl-8' : ''}>
              <PersonaDilutionCalculator />
            </div>
          </section>
        );
      case 'implementation':
        return (
          <section key="implementation" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>3-Step Extraction Guide</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              <p>{deepContent?.implementationGuide}</p>
            </div>
          </section>
        );
      case 'faq':
        return (
          <section key="faq" className="mb-16">
            <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
              {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
              <span>SEO FAQ</span>
            </h2>
            <div className={`text-lg leading-relaxed text-slate-600 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
              {deepContent?.seoFaq?.questions?.map((faq: any, index: number) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
              {deepContent?.seoCompletion && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-sm">
                  <p>{deepContent.seoCompletion}</p>
                </div>
              )}
            </div>
          </section>
        );
      default:
        return null;
    }
  };
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Main content */}
      <div className="max-w-7xl mx-auto my-12 px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Main content (65%) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 p-8 md:p-10 shadow-sm">
              {/* Breadcrumbs */}
              <Breadcrumbs keyword={keyword} />
              {/* H1 Title */}
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-12">
                {keyword.title}
              </h1>

              {/* 动态渲染模块 */}
              {shuffledSections.map((section, index) => {
                // 在第二个模块后插入额外内容
                if (index === 1 && injectedContent) {
                  return (
                    <React.Fragment key={`section-${section}`}>
                      {renderSection(section)}
                      {injectedContent}
                    </React.Fragment>
                  );
                }
                return renderSection(section);
              })}

              {/* Related Styles */}
              {relatedLinks.length > 0 && (
                <section className="mt-16 pt-8 border-t border-slate-200">
                  <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${headingStyle === 'icon' ? 'flex items-start' : ''}`}>
                    {headingStyle === 'icon' && <div className="w-4 h-12 bg-red-600 mr-4 mt-1"></div>}
                    <span>Related Styles</span>
                  </h2>
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${headingStyle === 'icon' ? 'pl-8' : ''}`}>
                    {relatedLinks.map((link) => (
                      <a 
                        key={link.slug} 
                        href={`/${link.slug}`} 
                        className="bg-white border border-slate-200 p-6 rounded-sm hover:border-red-600 transition-colors"
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
            </div>
          </div>

          {/* Right column - Sticky Sidebar (35%) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 p-8 sticky top-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Technical Analysis</h3>
              
              {/* Technical metrics */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-slate-900">Complexity</p>
                    <p className="text-slate-600">Medium</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div className="bg-red-600 h-2 w-1/2"></div>
                  </div>
                </div>
                
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-slate-900">Implementation Time</p>
                    <p className="text-slate-600">15-30 min</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div className="bg-red-600 h-2 w-2/3"></div>
                  </div>
                </div>
                
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-slate-900">Success Rate</p>
                    <p className="text-slate-600">95%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div className="bg-red-600 h-2 w-19/20"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-slate-900">Compatibility</p>
                    <p className="text-slate-600">High</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div className="bg-red-600 h-2 w-4/5"></div>
                  </div>
                </div>
              </div>
              
              {/* User Comments */}
              <h3 className="text-xl font-bold text-slate-900 mt-10 mb-6">User Comments</h3>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-slate-900">John Doe</p>
                      <p className="text-sm text-slate-500">2 days ago</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    This tool saved me hours of manual work. The generated code was clean and worked perfectly on the first try.
                  </p>
                </div>
                
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Smith" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-slate-900">Jane Smith</p>
                      <p className="text-sm text-slate-500">1 week ago</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    I was struggling with authentication implementation, but this guide made it so simple. Highly recommended!
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Mike Johnson" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-slate-900">Mike Johnson</p>
                      <p className="text-sm text-slate-500">2 weeks ago</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    The performance optimization tips were exactly what I needed for my React app. Load times improved by 40%!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center space-y-1">
          <p className="text-slate-600 text-sm">
            © 2026 PersonaLock. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm">
            Support: <a href="mailto:457239850@qq.com" className="text-blue-600 hover:underline">457239850@qq.com</a>
            {' · '}
            <Link href="/sitemap" className="text-blue-600 hover:underline">Sitemap</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
