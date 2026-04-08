import React from 'react';
import Link from 'next/link';
import ExtractorInput from '../components/ExtractorInput';
import PersonaDilutionCalculator from '../components/PersonaDilutionCalculator';
import ComparisonTable from '../components/ComparisonTable';
import Breadcrumbs from '../components/Breadcrumbs';
import YouMayAlsoLike from '../components/YouMayAlsoLike';

interface LayoutBProps {
  keyword: any;
  codeExample: string;
  shuffledSections?: string[];
  headingStyle?: 'plain' | 'icon';
  injectedContent?: React.ReactNode;
  ctaButtonText?: string;
  relatedLinks?: any[];
  deepContent?: any;
}

export default function Layout_B({ 
  keyword, 
  codeExample, 
  shuffledSections = ['problem', 'tool', 'guide', 'code'],
  headingStyle = 'plain',
  injectedContent,
  ctaButtonText = 'Analyze & Extract',
  relatedLinks = [],
  deepContent
}: LayoutBProps) {
  // 渲染单个模块
  const renderSection = (section: string) => {
    switch (section) {
      case 'problem':
        return (
          <section key="problem" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              The Problem
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              <p className="mb-4">
                {keyword.problem_description}
              </p>
              <p className="mb-4">
                This issue affects developers of all skill levels, from beginners to experienced professionals. Without the right tools and knowledge, it can lead to wasted time, security vulnerabilities, and suboptimal performance.
              </p>
              <p>
                Many developers spend hours manually converting code, researching best practices, or debugging issues that could be easily resolved with the right approach.
              </p>
            </div>
          </section>
        );
      case 'tool':
        return (
          <section key="tool" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              The Tool
            </h2>
            <ExtractorInput 
              rounded="rounded-lg" 
              spacing="p-8"
              buttonText={ctaButtonText}
              className="bg-slate-700 border border-slate-600"
            />
          </section>
        );
      case 'guide':
        return (
          <section key="guide" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              The Guide
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
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
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Code Example
            </h2>
            <div className="bg-slate-900 text-white p-6 rounded-lg overflow-x-auto border border-slate-700">
              <pre className="text-sm font-mono">{codeExample}</pre>
            </div>
          </section>
        );
      case 'intro':
        return (
          <section key="intro" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Introduction
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              <p>{deepContent?.intro}</p>
            </div>
          </section>
        );
      case 'linguistic':
        return (
          <section key="linguistic" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Linguistic Analysis
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              <p>{deepContent?.linguisticAnalysis}</p>
            </div>
          </section>
        );
      case 'prediction':
        return (
          <section key="prediction" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              The 2026 Prediction
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              <p>{deepContent?.prediction2026}</p>
            </div>
          </section>
        );
      case 'ai-smell':
        return (
          <section key="ai-smell" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              AI Smell Index Table
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-700">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 px-6 py-3 text-left font-semibold text-slate-300">
                      Metric
                    </th>
                    <th className="border border-slate-700 px-6 py-3 text-left font-semibold text-slate-300">
                      Default LLM
                    </th>
                    <th className="border border-slate-700 px-6 py-3 text-left font-semibold text-slate-300">
                      With Your DNA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      metric: 'Vocabulary Variety',
                      defaultLLM: keyword.template_type === 'CLICHE_KILLER' ? 'Limited to common words and phrases, lacks specificity' : 'Limited to common words and phrases, lacks specificity',
                      withYourDNA: keyword.template_type === 'CLICHE_KILLER' ? 'Reflects your unique word choices and specialized terminology' : 'Reflects your unique word choices and specialized terminology'
                    },
                    {
                      metric: 'Sentence Rhythm',
                      defaultLLM: keyword.template_type === 'PLATFORM_ADAPTOR' ? 'Does not adapt to platform-specific rhythm requirements' : 'Uniform sentence structure, predictable flow',
                      withYourDNA: keyword.template_type === 'PLATFORM_ADAPTOR' ? 'Adapts your rhythm to fit platform-specific expectations' : 'Matches your natural speaking/writing rhythm and cadence'
                    },
                    {
                      metric: 'Emotional Resonance',
                      defaultLLM: keyword.template_type === 'IDENTITY_LOCK' ? 'No emotional consistency, generic tone' : 'Generic emotional tone, lacks personal connection',
                      withYourDNA: keyword.template_type === 'IDENTITY_LOCK' ? 'Perfectly matches your emotional tone and personality' : 'Captures your authentic emotional voice and nuances'
                    },
                    {
                      metric: 'Cliche Density',
                      defaultLLM: keyword.template_type === 'CLICHE_KILLER' ? 'Extremely high cliche usage, generic and unoriginal' : 'High usage of overused phrases and expressions',
                      withYourDNA: keyword.template_type === 'CLICHE_KILLER' ? 'Virtually no cliches, completely original expression' : 'Minimal cliches, more original and fresh language'
                    }
                  ].map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                      <td className="border border-slate-700 px-6 py-4 font-medium text-white">
                        {item.metric}
                      </td>
                      <td className="border border-slate-700 px-6 py-4 text-slate-300">
                        {item.defaultLLM}
                      </td>
                      <td className="border border-slate-700 px-6 py-4 text-slate-300">
                        {item.withYourDNA}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      case 'calculator':
        return (
          <section key="calculator" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Persona Dilution Calculator
            </h2>
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg">
              <PersonaDilutionCalculator className="bg-slate-900 border-slate-700 text-white" />
            </div>
          </section>
        );
      case 'implementation':
        return (
          <section key="implementation" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              3-Step Extraction Guide
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              <p>{deepContent?.implementationGuide}</p>
            </div>
          </section>
        );
      case 'faq':
        return (
          <section key="faq" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              SEO FAQ
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              {deepContent?.seoFaq?.questions?.map((faq: any, index: number) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-white mb-2">{faq.question}</h3>
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
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Main content */}
      <div className="max-w-7xl mx-auto my-12 px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Main content (65%) */}
          <div className="lg:col-span-8">
            <div className="bg-slate-800 border border-slate-700 p-8 md:p-10">
              {/* Breadcrumbs */}
              <Breadcrumbs keyword={keyword} />
              {/* H1 Title */}
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-12 text-center">
                {keyword.title}
              </h1>

              {/* Before/After Comparison */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Before vs After
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 border border-slate-600 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Before</h3>
                    <div className="bg-slate-900 p-4 rounded border border-slate-600 h-64 overflow-auto">
                      <pre className="text-sm text-slate-300 font-mono">
{`// Manual process
// Step 1: Research best practices
// Step 2: Write code from scratch
// Step 3: Test and debug
// Step 4: Optimize performance
// Step 5: Document the solution

// This process can take hours or days`}
                      </pre>
                    </div>
                  </div>
                  <div className="bg-slate-700 border border-slate-600 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400 mb-4 text-center">After</h3>
                    <div className="bg-slate-900 p-4 rounded border border-slate-600 h-64 overflow-auto">
                      <pre className="text-sm text-slate-300 font-mono">
{`// Using our tool
// Step 1: Input your requirements
// Step 2: Click "Generate Solution"
// Step 3: Implement the generated code

// This process takes minutes`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

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
                <section className="mt-16 pt-8 border-t border-slate-700">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Related Styles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedLinks.map((link) => (
                      <a 
                        key={link.slug} 
                        href={`/${link.slug}`} 
                        className="bg-slate-700 border border-slate-600 p-6 rounded-lg hover:border-red-600 transition-colors"
                      >
                        <h3 className="font-bold text-white mb-2">{link.title}</h3>
                        <p className="text-sm text-slate-300">{link.how_to_solve.substring(0, 100)}...</p>
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
            <div className="bg-slate-800 border border-slate-700 p-8 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Performance Metrics</h3>
              
              {/* Performance metrics */}
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-white">Time Saved</p>
                    <p className="text-green-400">90%</p>
                  </div>
                  <div className="w-full bg-slate-700 h-2">
                    <div className="bg-green-500 h-2 w-9/10"></div>
                  </div>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-white">Error Reduction</p>
                    <p className="text-green-400">85%</p>
                  </div>
                  <div className="w-full bg-slate-700 h-2">
                    <div className="bg-green-500 h-2 w-17/20"></div>
                  </div>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-white">Code Quality</p>
                    <p className="text-green-400">95%</p>
                  </div>
                  <div className="w-full bg-slate-700 h-2">
                    <div className="bg-green-500 h-2 w-19/20"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-white">User Satisfaction</p>
                    <p className="text-green-400">98%</p>
                  </div>
                  <div className="w-full bg-slate-700 h-2">
                    <div className="bg-green-500 h-2 w-full"></div>
                  </div>
                </div>
              </div>
              
              {/* User Comments */}
              <h3 className="text-xl font-bold text-white mt-10 mb-6 text-center">User Comments</h3>
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-white">John Doe</p>
                      <p className="text-sm text-slate-400">2 days ago</p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    This tool saved me hours of manual work. The generated code was clean and worked perfectly on the first try.
                  </p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Smith" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-white">Jane Smith</p>
                      <p className="text-sm text-slate-400">1 week ago</p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    I was struggling with authentication implementation, but this guide made it so simple. Highly recommended!
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Mike Johnson" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p className="font-medium text-white">Mike Johnson</p>
                      <p className="text-sm text-slate-400">2 weeks ago</p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    The performance optimization tips were exactly what I needed for my React app. Load times improved by 40%!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center space-y-1">
          <p className="text-slate-400 text-sm">
            © 2026 PersonaLock. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm">
            Support: <a href="mailto:457239850@qq.com" className="text-blue-400 hover:underline">457239850@qq.com</a>
            {' · '}
            <Link href="/sitemap" className="text-blue-400 hover:underline">Sitemap</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
