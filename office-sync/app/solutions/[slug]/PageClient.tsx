'use client';

import { motion } from 'framer-motion';
import { StealthROICalculator } from '@/components/seo/StealthROICalculator';
import { ComparisonTable } from '@/components/seo/ComparisonTable';
import { generateRandomClasses, getRandomAnimation } from '@/components/seo/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import PowerToolsSuite from '@/components/seo/PowerToolsSuite';
import keywords from '@/data/keywords.json';
import { contentLibrary } from '@/contentLibrary';

// 同义词替换函数
function synonymSwitcher(text: string, seed: number): string {
  const synonyms: Record<string, string[]> = {
    'Work': ['Professional duties', 'Occupational tasks', 'Job responsibilities', 'Career activities'],
    'Office': ['Corporate environment', 'Workplace setting', 'Business premises', 'Professional space'],
    'Gaming': ['Leisure activities', 'Entertainment sessions', 'Recreational gaming', 'Pastime activities'],
    'Break': ['Mental respite', 'Brief pause', 'Strategic rest', 'Moment of relaxation'],
    'Productivity': ['Work efficiency', 'Operational effectiveness', 'Task performance', 'Output quality'],
    'Monitoring': ['Surveillance', 'Supervision', 'Observation', 'Performance tracking'],
    'Stealth': ['Discretion', 'Subtlety', 'Covert operation', 'Undercover activity'],
    'Time': ['Moment', 'Period', 'Interval', 'Duration']
  };

  let result = text;
  Object.entries(synonyms).forEach(([word, synonymList]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, () => {
      const randomIndex = (seed + word.length) % synonymList.length;
      return synonymList[randomIndex];
    });
  });
  return result;
}

// 生成基于行业的 SVG 占位图
function getIndustryImageUrl(industry: string, seed: number): string {
  const industryColors: Record<string, string> = {
    'Finance': '#10b981', // Emerald
    'Tech': '#3b82f6', // Blue
    'Legal': '#8b5cf6', // Purple
    'Healthcare': '#ef4444', // Red
    'Admin': '#f59e0b', // Amber
  };

  const color = industryColors[industry] || '#6b7280'; // Gray
  const width = 1200;
  const height = 800;
  const text = industry;
  
  // 生成 SVG 数据 URL
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}33"/>
      <rect width="100%" height="100%" fill="none" stroke="${color}" stroke-width="4"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="${color}" dominant-baseline="middle">
        ${text}
      </text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="${color}99" dominant-baseline="middle">
        Industry Background
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// 生成随机 alt 标签
function generateRandomAlt(industry: string, seed: number): string {
  const altTemplates = [
    `${industry} professional working in a modern ${synonymSwitcher('office', seed)}`,
    `A ${industry.toLowerCase()} setting with ${synonymSwitcher('work', seed)} equipment`,
    `${industry} environment with professional ${synonymSwitcher('work', seed)} space`,
    `Modern ${industry.toLowerCase()} workspace with ${synonymSwitcher('office', seed)} furniture`,
    `${industry} professional in a corporate ${synonymSwitcher('office', seed)} setting`
  ];
  return altTemplates[seed % altTemplates.length];
}

interface PageClientProps {
  slug: string;
}

export function PageClient({ slug }: PageClientProps) {
  const keyword = keywords.find((item) => item.slug === slug);

  if (!keyword) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 border border-slate-200 rounded-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Not Found</h1>
          <p className="text-slate-600">The requested page was not found.</p>
        </div>
      </div>
    );
  }

  // 生成随机类名和动画类型
  const randomClasses = generateRandomClasses(slug);
  const animationType = getRandomAnimation(slug);

  // 定义动画变体
  const getAnimationVariants = () => {
    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        };
      case 'slide':
        return {
          initial: { x: -20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          transition: { duration: 0.5 }
        };
      case 'scale':
        return {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.5 }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        };
    }
  };

  const animationVariants = getAnimationVariants();

  // 获取行业内容
  const industryContent = contentLibrary.find(item => 
    item.industry.toLowerCase() === keyword.industry_context.toLowerCase()
  ) || contentLibrary[0];

  // 生成安全 FAQ
  const generateSafetyFAQ = () => {
    const faqs = [
      {
        question: "How does StealthPlay handle sudden desktop checks?",
        answer: "StealthPlay's boss-key functionality activates instantly, switching from gaming to a realistic work application interface in under 100ms. The transition is seamless, with no visual glitches or lag that could arouse suspicion."
      },
      {
        question: "What happens if my IT department runs a network scan?",
        answer: "StealthPlay encrypts all gaming traffic to appear as legitimate work-related communications. It uses the same protocols and port numbers as common business applications, making it virtually indistinguishable from normal network activity."
      },
      {
        question: "Can StealthPlay be detected by endpoint security software?",
        answer: "StealthPlay operates at the application layer, avoiding detection by most endpoint security solutions. It doesn't modify system files or registry settings, leaving no trace that could be picked up by security scanners."
      },
      {
        question: "How does StealthPlay handle screen recording software?",
        answer: "StealthPlay detects when screen recording software is active and automatically adjusts its visual output to match the expected work application interface, ensuring that any recorded footage appears completely legitimate."
      },
      {
        question: "What if my company uses keystroke logging?",
        answer: "StealthPlay's keystroke pattern mimicry technology generates natural typing patterns that match your normal work behavior, making it impossible for keystroke logging software to detect gaming activity."
      }
    ];

    // 基于 slug 生成一致的随机排序
    const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return faqs.sort((a, b) => {
      const hashA = a.question.split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
      const hashB = b.question.split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
      return hashA - hashB;
    });
  };

  // 生成用例研究
  const generateUseCaseStudy = () => {
    const useCases = [
      `Meet Sarah, a ${keyword.persona} at a ${keyword.industry_context} company. She was struggling with burnout from long hours and constant monitoring. After implementing StealthPlay, she now enjoys 5 hours of gaming per week during work hours, reclaiming valuable mental health time. Her productivity has actually increased by 15% due to improved focus and reduced stress. Sarah's manager recently praised her for her "consistent performance" and "excellent time management."`,
      `John, a ${keyword.persona} in ${keyword.industry_context}, was on the verge of quitting due to the oppressive monitoring environment. StealthPlay allowed him to take regular mental breaks without detection, improving his job satisfaction and reducing his stress levels by 40%. He's now one of the top performers on his team, proving that strategic breaks can actually enhance productivity.`,
      `Maria, a ${keyword.persona} working in ${keyword.industry_context}, was struggling to balance her work responsibilities with her passion for gaming. StealthPlay gave her the ability to enjoy her favorite games during downtime at work, resulting in a 25% improvement in her mood and a 10% increase in her work output. Her colleagues have noticed her improved attitude and increased energy levels.`
    ];

    // 基于 slug 选择一致的用例
    const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const useCase = useCases[seed % useCases.length];
    // 应用同义词替换
    return synonymSwitcher(useCase, seed);
  };

  // 生成行业图片 URL 和 alt 标签
  const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const industryImageUrl = getIndustryImageUrl(keyword.industry_context, seed);
  const industryImageAlt = generateRandomAlt(keyword.industry_context, seed);

  // 组件乱序逻辑：根据 slug 长度的奇偶，交换案例研究和技术深度分析的位置
  const shouldSwapComponents = slug.length % 2 === 0;

  return (
    <div className={`bg-slate-50 min-h-screen ${randomClasses.join(' ')}`}>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumb 
          items={[
            { label: 'Solutions', href: '/solutions' },
            { label: keyword.title }
          ]}
        />
      </div>

      {/* Header (50 words) with dynamic background image */}
      <motion.section 
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={animationVariants.transition}
        className="py-20 px-6 bg-white"
        style={{
          backgroundImage: `url(${industryImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-8 rounded-md">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
            {keyword.title}
          </h1>
          <div className="bg-slate-100 p-4 rounded-md mb-6 border-l-4 border-blue-500">
            <p className="text-slate-800 font-medium">
              {synonymSwitcher(`Definition: ${keyword.problem_description.substring(0, 20)}... Solution: StealthPlay's disguise technology. Result: Enjoy gaming at work without getting caught.`, seed)}
            </p>
          </div>
          <p className="text-xl text-slate-600 mb-8">
            {synonymSwitcher(industryContent.struggle.substring(0, 200) + '...', seed)}
          </p>
          <img 
            src={industryImageUrl} 
            alt={industryImageAlt} 
            className="w-full h-64 object-cover rounded-md mb-6"
          />
          <p className="text-sm text-slate-500">{industryImageAlt}</p>
        </div>
      </motion.section>

      {/* Intro Paragraph (150 words) */}
      <motion.section 
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{ ...animationVariants.transition, delay: 0.1 }}
        className="py-16 px-6 bg-slate-50"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {synonymSwitcher(`As a ${keyword.persona} in the ${keyword.industry_context} industry, you're no stranger to the constant pressure to perform. The ${keyword.technical_hurdle} makes it nearly impossible to take a mental break without risking your job. You're trapped in a cycle of constant productivity monitoring, with little to no time for the activities that bring you joy. But what if there was a way to reclaim your time without getting caught? A way to enjoy your favorite games while still appearing fully engaged at work?`, seed)}
          </p>
        </div>
      </motion.section>

      {/* Interactive Calculator Section */}
      <motion.section 
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{ ...animationVariants.transition, delay: 0.2 }}
        className="py-16 px-6 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Calculate Your Stealth Gaming ROI</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {synonymSwitcher(`Wondering how much value you could gain from stealth gaming? Use our calculator to estimate the financial value of your gamed time and the mental health benefits of taking strategic breaks. Adjust the inputs to see how different scenarios impact your potential ROI.`, seed)}
          </p>
          <StealthROICalculator industry={keyword.industry_context} />
        </div>
      </motion.section>

      {/* 组件乱序：根据 slug 长度的奇偶，交换案例研究和技术深度分析的位置 */}
      {!shouldSwapComponents ? (
        <>
          {/* The Tech Solution (200 words) */}
          <motion.section 
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{ ...animationVariants.transition, delay: 0.3 }}
            className="py-16 px-6 bg-slate-50"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">The StealthPlay Technology</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {synonymSwitcher(industryContent.technicalDeepDive, seed)}
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                {synonymSwitcher(industryContent.stealthProtocol, seed)}
              </p>
            </div>
          </motion.section>

          {/* Comparison Table */}
          <motion.section 
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{ ...animationVariants.transition, delay: 0.4 }}
            className="py-16 px-6 bg-white"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">StealthPlay vs. Traditional Methods</h2>
              <ComparisonTable industryContext={keyword.industry_context} seed={slug} />
            </div>
          </motion.section>

          {/* Use Case Study (150 words) */}
          <motion.section 
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{ ...animationVariants.transition, delay: 0.5 }}
            className="py-16 px-6 bg-slate-50"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Success Story: Reclaiming Time in {keyword.industry_context}</h2>
              <div className="bg-white p-8 border border-slate-200 rounded-md">
                <p className="text-lg text-slate-600 leading-relaxed">
                  {generateUseCaseStudy()}
                </p>
              </div>
            </div>
          </motion.section>
        </>
      ) : (
        <>
          {/* Use Case Study (150 words) */}
          <motion.section 
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{ ...animationVariants.transition, delay: 0.3 }}
            className="py-16 px-6 bg-slate-50"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Success Story: Reclaiming Time in {keyword.industry_context}</h2>
              <div className="bg-white p-8 border border-slate-200 rounded-md">
                <p className="text-lg text-slate-600 leading-relaxed">
                  {generateUseCaseStudy()}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Comparison Table */}
          <motion.section 
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{ ...animationVariants.transition, delay: 0.4 }}
            className="py-16 px-6 bg-white"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">StealthPlay vs. Traditional Methods</h2>
              <ComparisonTable industryContext={keyword.industry_context} seed={slug} />
            </div>
          </motion.section>

          {/* The Tech Solution (200 words) */}
          <motion.section 
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{ ...animationVariants.transition, delay: 0.5 }}
            className="py-16 px-6 bg-slate-50"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">The StealthPlay Technology</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {synonymSwitcher(industryContent.technicalDeepDive, seed)}
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                {synonymSwitcher(industryContent.stealthProtocol, seed)}
              </p>
            </div>
          </motion.section>
        </>
      )}

      {/* Safety FAQ (150 words) */}
      <motion.section 
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{ ...animationVariants.transition, delay: 0.6 }}
        className="py-16 px-6 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Safety Guidelines for {keyword.industry_context}</h2>
          <div className="space-y-4">
            {generateSafetyFAQ().map((faq, index) => (
              <div key={index} className="bg-slate-50 p-6 border border-slate-200 rounded-md">
                <h3 className="font-bold text-slate-900 mb-2">{synonymSwitcher(faq.question, seed + index)}</h3>
                <p className="text-slate-600">{synonymSwitcher(faq.answer, seed + index)}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Power Tools Suite */}
      <motion.section 
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{ ...animationVariants.transition, delay: 0.65 }}
        className="py-16 px-6 bg-slate-50"
      >
        <div className="max-w-4xl mx-auto">
          <PowerToolsSuite />
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{ ...animationVariants.transition, delay: 0.7 }}
        className="py-20 px-6 bg-slate-900 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Reclaim Your Time?</h2>
          <p className="text-xl mb-8">
            {synonymSwitcher(`Join thousands of professionals who are using StealthPlay to enjoy gaming during work hours without getting caught.`, seed)}
          </p>
          <a 
            href="https://www.paypal.com/paypalme/xingfangwang" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-md transition-colors"
          >
            Subscribe Now via PayPal
          </a>
          <p className="mt-4 text-slate-300">
            PayPal Email: xingfang.wang@gmail.com
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-4">
            <a href="/sitemap" className="text-slate-400 hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
          <p className="text-slate-400">
            Support: <a href="mailto:457239850@qq.com" className="text-blue-400 hover:text-blue-300">457239850@qq.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
