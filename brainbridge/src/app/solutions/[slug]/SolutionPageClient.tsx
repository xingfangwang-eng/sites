'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../../../../components/seo/HeroSection';
import { ProblemPainPoint } from '../../../../components/seo/ProblemPainPoint';
import { SolutionBlock } from '../../../../components/seo/SolutionBlock';
import { QuickAction } from '../../../../components/seo/QuickAction';
import { FAQSection } from '../../../../components/seo/FAQSection';
import { ComparisonTable } from '../../../../components/seo/ComparisonTable';
import { Zap } from 'lucide-react';
import Breadcrumb from '../../../../components/seo/Breadcrumb';
import PowerToolsSuite from '../../../../components/seo/PowerToolsSuite';

// Import EfficiencyCalculator component
import { EfficiencyCalculator } from '../../../../components/seo/EfficiencyCalculator';

interface FAQItem {
  question: string;
  answer: string;
}

interface SolutionPageClientProps {
  keyword: {
    title: string;
    problem_description: string;
    how_to_solve: string;
    category: string;
    layout_seed: number;
    related_tools: string[];
  };
  randomStyles: {
    padding: string;
    gap: string;
  };
  buttonText: string;
  faqItems: FAQItem[];
}

export function SolutionPageClient({ keyword, randomStyles, buttonText, faqItems }: SolutionPageClientProps) {
  // State for floating CTA
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  
  // Handle scroll to show floating CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
      
      if (scrollPercentage >= 50) {
        setShowFloatingCTA(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // PayPal payment URL with correct account
  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=xingfang.wang@gmail.com&item_name=BrainBridge%20Lifetime%20Access&amount=6.90&currency_code=USD`;
  
  // Generate pain points and solutions for components
  const painPoints = [
    `Context switching between ${keyword.related_tools.join(' and ')} is time-consuming`,
    'Manual copy-pasting causes formatting issues',
    'Losing important AI-generated content',
    'Inconsistent workflow across different tools'
  ];
  
  const solutions = [
    'One-click memory capture with keyboard shortcut',
    'Seamless sync between all your AI tools',
    'Clean code extraction without formatting issues',
    'Searchable history of all your AI interactions'
  ];
  
  const steps = [
    {
      number: 1,
      title: 'Install BrainBridge',
      description: 'Add the Chrome extension and create your account'
    },
    {
      number: 2,
      title: 'Capture Content',
      description: 'Use Ctrl+Shift+S to save any AI-generated content'
    },
    {
      number: 3,
      title: 'Access Anywhere',
      description: 'Retrieve your memories from any device or AI tool'
    },
    {
      number: 4,
      title: 'Sync Between Tools',
      description: 'Easily transfer context between different AI platforms'
    }
  ];
  
  const features = [
    {
      icon: 'code' as const,
      title: 'Code Extraction',
      description: 'Cleanly extract code without formatting issues'
    },
    {
      icon: 'database' as const,
      title: 'Cloud Storage',
      description: 'Securely store all your AI memories in the cloud'
    },
    {
      icon: 'cloud' as const,
      title: 'Real-time Sync',
      description: 'Instantly sync your memories across all devices'
    },
    {
      icon: 'globe' as const,
      title: 'Cross-platform',
      description: 'Works with all major AI tools and platforms'
    }
  ];
  
  // Render components based on layout_seed
  const renderComponents = () => {
    switch (keyword.layout_seed) {
      case 1:
        return (
          <>
            <HeroSection
              title={keyword.title}
              subtitle={keyword.problem_description}
              variant="gradient"
              buttonText="Get Started"
              buttonLink={paypalUrl}
            />
            <ProblemPainPoint
              title="The Challenge"
              description="What you're facing when working with multiple AI tools"
              variant="comparison"
              painPoints={painPoints}
              solutions={solutions}
            />
            <SolutionBlock
              title="The Solution"
              description="How BrainBridge solves your AI memory problems"
              variant="steps"
              steps={steps}
            />
            <div className="max-w-4xl mx-auto px-6 py-16">
              <QuickAction
                category={keyword.category}
                buttonLink={paypalUrl}
                buttonText={buttonText}
              />
            </div>
            
            {/* Comparison Table and Efficiency Calculator */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonTable keyword={keyword.title} relatedTools={keyword.related_tools} />
                <EfficiencyCalculator category={keyword.category} />
              </div>
            </div>
            
            <FAQSection
              keyword={keyword.title}
              faqItems={faqItems}
            />
          </>
        );
      case 2:
        return (
          <>
            <HeroSection
              title={keyword.title}
              subtitle={keyword.problem_description}
              variant="solid"
              buttonText="Get Started"
              buttonLink={paypalUrl}
            />
            <SolutionBlock
              title="The Solution"
              description="How BrainBridge solves your AI memory problems"
              variant="features"
              features={features}
            />
            <div className="max-w-4xl mx-auto px-6 py-16">
              <QuickAction
                category={keyword.category}
                buttonLink={paypalUrl}
                buttonText={buttonText}
              />
            </div>
            
            {/* Comparison Table and Efficiency Calculator */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonTable keyword={keyword.title} relatedTools={keyword.related_tools} />
                <EfficiencyCalculator category={keyword.category} />
              </div>
            </div>
            
            <ProblemPainPoint
              title="The Challenge"
              description="What you're facing when working with multiple AI tools"
              variant="card"
              painPoints={painPoints}
            />
          </>
        );
      case 3:
        return (
          <>
            <ProblemPainPoint
              title="The Challenge"
              description="What you're facing when working with multiple AI tools"
              variant="comparison"
              painPoints={painPoints}
              solutions={solutions}
            />
            <HeroSection
              title={keyword.title}
              subtitle={keyword.problem_description}
              variant="gradient"
              buttonText="Get Started"
              buttonLink={paypalUrl}
            />
            <SolutionBlock
              title="The Solution"
              description="How BrainBridge solves your AI memory problems"
              variant="steps"
              steps={steps}
            />
            
            {/* Comparison Table and Efficiency Calculator */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonTable keyword={keyword.title} relatedTools={keyword.related_tools} />
                <EfficiencyCalculator category={keyword.category} />
              </div>
            </div>
            
            <FAQSection
              keyword={keyword.title}
              faqItems={faqItems}
            />
            <div className="max-w-4xl mx-auto px-6 py-16">
              <QuickAction
                category={keyword.category}
                buttonLink={paypalUrl}
                buttonText={buttonText}
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <SolutionBlock
              title="The Solution"
              description="How BrainBridge solves your AI memory problems"
              variant="features"
              features={features}
            />
            <HeroSection
              title={keyword.title}
              subtitle={keyword.problem_description}
              variant="solid"
              buttonText="Get Started"
              buttonLink={paypalUrl}
            />
            <div className="max-w-4xl mx-auto px-6 py-16">
              <QuickAction
                category={keyword.category}
                buttonLink={paypalUrl}
                buttonText={buttonText}
              />
            </div>
            
            {/* Comparison Table and Efficiency Calculator */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonTable keyword={keyword.title} relatedTools={keyword.related_tools} />
                <EfficiencyCalculator category={keyword.category} />
              </div>
            </div>
            
            <ProblemPainPoint
              title="The Challenge"
              description="What you're facing when working with multiple AI tools"
              variant="card"
              painPoints={painPoints}
            />
            <FAQSection
              keyword={keyword.title}
              faqItems={faqItems}
            />
          </>
        );
      default:
        return (
          <>
            <HeroSection
              title={keyword.title}
              subtitle={keyword.problem_description}
              variant="gradient"
              buttonText="Get Started"
              buttonLink={paypalUrl}
            />
            <ProblemPainPoint
              title="The Challenge"
              description="What you're facing when working with multiple AI tools"
              variant="comparison"
              painPoints={painPoints}
              solutions={solutions}
            />
            <SolutionBlock
              title="The Solution"
              description="How BrainBridge solves your AI memory problems"
              variant="steps"
              steps={steps}
            />
            <div className="max-w-4xl mx-auto px-6 py-16">
              <QuickAction
                category={keyword.category}
                buttonLink={paypalUrl}
                buttonText={buttonText}
              />
            </div>
            
            {/* Comparison Table and Efficiency Calculator */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonTable keyword={keyword.title} relatedTools={keyword.related_tools} />
                <EfficiencyCalculator category={keyword.category} />
              </div>
            </div>
            
            <FAQSection
              keyword={keyword.title}
              faqItems={faqItems}
            />
          </>
        );
    }
  };
  
  return (
    <div className={`${randomStyles.padding} ${randomStyles.gap} bg-slate-50`}>
      {/* 面包屑导航 */}
      <Breadcrumb 
        items={[
          { label: 'AI Workflow Solutions', href: '/solutions' },
          { label: keyword.title }
        ]} 
      />
      
      {renderComponents()}
      
      {/* Floating CTA */}
      {showFloatingCTA && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <a
            href={paypalUrl}
            className="flex items-center gap-3 bg-red-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-red-700 transition-colors"
          >
            <Zap className="w-6 h-6" />
            <span>Get BrainBridge for $6.9</span>
          </a>
        </motion.div>
      )}
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqItems.map((item, index) => ({
              '@type': 'Question',
              'name': item.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer
              }
            }))
          })
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': 'BrainBridge',
            'description': `A tool to bridge the gap between ${keyword.related_tools.join(' and ')} for ${keyword.title}`,
            'offers': {
              '@type': 'Offer',
              'price': '6.90',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock',
              'seller': {
                '@type': 'Person',
                'name': 'BrainBridge Team',
                'email': 'xingfang.wang@gmail.com'
              }
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'reviewCount': '1000'
            }
          })
        }}
      />

      {/* Power Tools Suite */}
      <PowerToolsSuite />

      {/* 页脚 */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600">
          <p>
            Support: <a href="mailto:457239850@qq.com" className="text-blue-600 hover:underline">457239850@qq.com</a>
          </p>
          <p className="text-slate-500 text-sm mt-2">
            <a href="/sitemap" className="text-blue-600 hover:underline">Sitemap</a>
            {' | '}
            BrainBridge © 2026 | All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
