import React from 'react';
import Link from 'next/link';
import ExtractorInput from '../components/ExtractorInput';
import PersonaDilutionCalculator from '../components/PersonaDilutionCalculator';
import ComparisonTable from '../components/ComparisonTable';
import Breadcrumbs from '../components/Breadcrumbs';
import YouMayAlsoLike from '../components/YouMayAlsoLike';

interface LayoutCProps {
  keyword: any;
  codeExample: string;
  shuffledSections?: string[];
  headingStyle?: 'plain' | 'icon';
  injectedContent?: React.ReactNode;
  ctaButtonText?: string;
  relatedLinks?: any[];
  deepContent?: any;
}

export default function Layout_C({ 
  keyword, 
  codeExample, 
  shuffledSections = ['problem', 'tool', 'guide', 'code'],
  headingStyle = 'plain',
  injectedContent,
  ctaButtonText = 'Analyze & Extract',
  relatedLinks = [],
  deepContent
}: LayoutCProps) {
  // 渲染单个模块
  const renderSection = (section: string) => {
    switch (section) {
      case 'problem':
        return (
          <div key="problem" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What is the problem?
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              <p className="mb-4">
                {keyword.problem_description}
              </p>
              <p>
                This issue affects developers of all skill levels, from beginners to experienced professionals. Without the right tools and knowledge, it can lead to wasted time, security vulnerabilities, and suboptimal performance.
              </p>
            </div>
          </div>
        );
      case 'tool':
        return (
          <div key="tool" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How does the tool work?
            </h2>
            <div className="text-lg leading-relaxed text-slate-600 mb-6">
              <p className="mb-4">
                {keyword.how_to_solve}
              </p>
              <p className="mb-4">
                Our approach is designed to be accessible to developers of all skill levels, while providing professional-grade results. We combine best practices with practical implementation to ensure your solution is both effective and maintainable.
              </p>
            </div>
            <ExtractorInput 
              rounded="rounded-lg" 
              spacing="p-6"
              buttonText={ctaButtonText}
            />
          </div>
        );
      case 'guide':
        return (
          <div key="guide" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What are the steps to implement the solution?
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              <ol className="list-decimal pl-6 space-y-4">
                <li className="pl-2">
                  <span className="font-medium">Input your code or command:</span> Paste your existing code or command into the input field.
                </li>
                <li className="pl-2">
                  <span className="font-medium">Analyze the input:</span> Our tool will automatically analyze your input and identify areas for improvement.
                </li>
                <li className="pl-2">
                  <span className="font-medium">Generate optimized code:</span> We'll generate clean, optimized code that addresses your specific needs.
                </li>
                <li className="pl-2">
                  <span className="font-medium">Implement the solution:</span> Copy the generated code and implement it in your project.
                </li>
                <li className="pl-2">
                  <span className="font-medium">Test and verify:</span> Test the solution to ensure it works as expected.
                </li>
              </ol>
            </div>
          </div>
        );
      case 'code':
        return (
          <div key="code" className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Can you provide a code example?
            </h2>
            <div className="bg-slate-900 text-white p-6 rounded-lg overflow-x-auto border border-slate-200">
              <pre className="text-sm font-mono">{codeExample}</pre>
            </div>
          </div>
        );
      case 'intro':
        return (
          <div key="intro" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Introduction
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              <p>{deepContent?.intro}</p>
            </div>
          </div>
        );
      case 'linguistic':
        return (
          <div key="linguistic" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Linguistic Analysis
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              <p>{deepContent?.linguisticAnalysis}</p>
            </div>
          </div>
        );
      case 'prediction':
        return (
          <div key="prediction" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              The 2026 Prediction
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              <p>{deepContent?.prediction2026}</p>
            </div>
          </div>
        );
      case 'ai-smell':
        return (
          <div key="ai-smell" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              AI Smell Index Table
            </h2>
            <ComparisonTable templateType={keyword.template_type} />
          </div>
        );
      case 'calculator':
        return (
          <div key="calculator" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Persona Dilution Calculator
            </h2>
            <PersonaDilutionCalculator />
          </div>
        );
      case 'implementation':
        return (
          <div key="implementation" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3-Step Extraction Guide
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              <p>{deepContent?.implementationGuide}</p>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div key="faq" className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              SEO FAQ
            </h2>
            <div className="text-lg leading-relaxed text-slate-600">
              {deepContent?.seoFaq?.questions?.map((faq: any, index: number) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Main content */}
      <div className="max-w-7xl mx-auto my-12 px-6 md:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs keyword={keyword} />
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
            {keyword.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Get answers to your questions and learn how to solve common problems with our comprehensive guide.
          </p>
        </div>

        {/* Q&A Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Main content (65%) */}
          <div className="lg:col-span-8">
            {/* 动态渲染模块 */}
                {shuffledSections.map((section, index) => {
                  // 在第二个模块后插入额外内容
                  if (index === 1 && injectedContent) {
                    return (
                      <React.Fragment key={`section-${section}`}>
                        {renderSection(section)}
                        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
                          {injectedContent}
                        </div>
                      </React.Fragment>
                    );
                  }
                  return renderSection(section);
                })}

                {/* Related Styles */}
                {relatedLinks.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      Related Styles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedLinks.map((link) => (
                        <a 
                          key={link.slug} 
                          href={`/${link.slug}`} 
                          className="border border-slate-200 p-4 rounded-lg hover:border-red-600 transition-colors"
                        >
                          <h3 className="font-bold text-slate-900 mb-2">{link.title}</h3>
                          <p className="text-sm text-slate-600">{link.how_to_solve.substring(0, 100)}...</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* You May Also Like - Power Tools */}
                <YouMayAlsoLike />
          </div>

          {/* Right column - Sticky Sidebar (35%) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-lg p-8 sticky top-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Related Questions</h3>
              
              {/* Related questions */}
              <div className="space-y-4 mb-8">
                <div className="border-b border-slate-200 pb-3">
                  <a href="#" className="text-slate-900 hover:text-red-600 font-medium">
                    How to optimize code performance?
                  </a>
                </div>
                <div className="border-b border-slate-200 pb-3">
                  <a href="#" className="text-slate-900 hover:text-red-600 font-medium">
                    What are common coding mistakes to avoid?
                  </a>
                </div>
                <div className="border-b border-slate-200 pb-3">
                  <a href="#" className="text-slate-900 hover:text-red-600 font-medium">
                    How to improve code readability?
                  </a>
                </div>
                <div className="border-b border-slate-200 pb-3">
                  <a href="#" className="text-slate-900 hover:text-red-600 font-medium">
                    What are the best practices for code documentation?
                  </a>
                </div>
                <div>
                  <a href="#" className="text-slate-900 hover:text-red-600 font-medium">
                    How to debug complex code issues?
                  </a>
                </div>
              </div>
              
              {/* User Comments */}
              <h3 className="text-xl font-bold text-slate-900 mb-6">User Feedback</h3>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-slate-900">John Doe</p>
                      <div className="flex text-yellow-400 text-sm">
                        ★★★★★
                      </div>
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
                      <div className="flex text-yellow-400 text-sm">
                        ★★★★★
                      </div>
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
                      <div className="flex text-yellow-400 text-sm">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    The performance optimization tips were exactly what I needed for my React app. Load times improved by 40%!
                  </p>
                </div>
              </div>
              
              {/* Tags */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                    {keyword.template_type.toLowerCase().replace('_', '-')}
                  </span>
                  <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                    {keyword.slug.split('-')[0]}
                  </span>
                  <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                    {keyword.slug.split('-')[1]}
                  </span>
                  <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                    development
                  </span>
                  <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                    optimization
                  </span>
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
