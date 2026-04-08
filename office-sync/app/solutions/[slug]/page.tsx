import { Metadata } from 'next';
import keywords from '@/data/keywords.json';
import { PageClient } from './PageClient';

// 服务器端函数
export async function generateStaticParams() {
  return keywords.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // 解包 params Promise
  const { slug } = await params;
  const keyword = keywords.find((item) => item.slug === slug);
  
  if (!keyword) {
    return {
      title: 'Stealth Gaming Solutions',
      description: 'Stealth gaming solutions for office workers',
    };
  }
  
  // 生成语义化段落的函数
  function generateSemanticContent(persona: string, industryContext: string, problemDescription: string): string {
    const templates = [
      `As a ${persona} in the ${industryContext} industry, you face unique challenges when it comes to balancing work and personal time. ${problemDescription} This is especially true in today's fast-paced work environment where every moment is monitored.`,
      `For ${persona}s working in ${industryContext}, finding ways to take mental breaks without appearing unproductive is a constant struggle. ${problemDescription} Traditional methods just don't cut it anymore in the age of advanced surveillance technology.`,
      `The ${industryContext} sector demands high levels of productivity and focus, which can lead to burnout for ${persona}s. ${problemDescription} It's time for a smarter solution that allows you to recharge without compromising your professional image.`,
      `Working as a ${persona} in ${industryContext} means you're constantly under pressure to perform. ${problemDescription} StealthPlay offers a discreet way to take much-needed breaks while maintaining your professional reputation.`,
      `In the competitive world of ${industryContext}, ${persona}s need every advantage they can get. ${problemDescription} StealthPlay provides the perfect balance between productivity and personal well-being.`
    ];
    
    const seed = (persona + industryContext).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return templates[seed % templates.length];
  }
  
  // 生成结构化数据的函数
  function generateStructuredData(keyword: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'StealthPlay',
      description: keyword.problem_description,
      brand: {
        '@type': 'Brand',
        name: 'StealthPlay'
      },
      offers: {
        '@type': 'Offer',
        price: '19.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      howTo: {
        '@type': 'HowTo',
        name: `How to ${keyword.title.toLowerCase()}`,
        step: [
          {
            '@type': 'HowToStep',
            text: 'Sign up for StealthPlay and get your API key'
          },
          {
            '@type': 'HowToStep',
            text: 'Configure your desired UI skin (Excel, VS Code, Outlook, etc.)'
          },
          {
            '@type': 'HowToStep',
            text: 'Enable mouse movement simulation for natural-looking activity'
          },
          {
            '@type': 'HowToStep',
            text: 'Set up email auto-reply to handle incoming messages'
          },
          {
            '@type': 'HowToStep',
            text: 'Start your gaming session and enjoy undisturbed play'
          }
        ]
      }
    };
  }
  
  const semanticContent = generateSemanticContent(keyword.persona, keyword.industry_context, keyword.problem_description);
  
  return {
    title: keyword.title,
    description: semanticContent.substring(0, 160),
    keywords: [keyword.keyword, 'stealth gaming', 'office gaming', 'quiet quitting'],
    openGraph: {
      title: keyword.title,
      description: semanticContent.substring(0, 160),
      type: 'website',
    },


  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  // 解包 params Promise
  const { slug } = await params;
  return <PageClient slug={slug} />;
}
