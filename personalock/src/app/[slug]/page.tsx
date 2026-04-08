import { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import Layout_A from '../layouts/Layout_A';
import Layout_B from '../layouts/Layout_B';
import Layout_C from '../layouts/Layout_C';
import Layout_D from '../layouts/Layout_D';

interface KeywordData {
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
}

// 从 keywords.json 文件读取数据
const getKeywordsData = (): any[] => {
  try {
    const filePath = join(process.cwd(), 'data', 'keywords.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data;
  } catch (error) {
    console.error('Error reading keywords.json:', error);
    return [];
  }
};

// 直接从 JSON 文件读取 keywords 数据
export const keywordsData = getKeywordsData();

// 获取页面数据
export async function generateStaticParams() {
  console.log('Generating static params for:', keywordsData.map(k => k.slug));
  return keywordsData.map((keyword) => ({ slug: keyword.slug }));
};

// 生成页面 metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const keyword = keywordsData.find((k) => k.slug === slug);
  
  // 生成 Metadata 标题
  const generateMetadataTitle = (keyword: any, seed: number) => {
    if (seed % 2 === 1) {
      return `${keyword.title} | PersonaLock`;
    } else {
      return `How to ${keyword.title} (2026 Guide)`;
    }
  };
  
  return {
    title: keyword ? generateMetadataTitle(keyword, keyword.seed) : 'Programming Guide',
    description: keyword?.how_to_solve.substring(0, 160) || 'Programming solutions and guides',
  };
}

// 生成代码示例
const getCodeExample = (slug: string): string => {
  const codeExamples: Record<string, string> = {
    'convert-curl-to-axios': `// Example: Convert curl to Axios
const axios = require('axios');

// Original curl command:
// curl -X POST https://api.example.com/data -H "Content-Type: application/json" -d '{"name": "John"}'

// Converted Axios request:
axios.post('https://api.example.com/data', {
  name: 'John'
}, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});`,
    'optimize-react-app-performance': `// Example: React performance optimization
import React, { memo, useMemo, useCallback } from 'react';

// Use memo to prevent unnecessary re-renders
const ExpensiveComponent = memo(({ data }) => {
  console.log('ExpensiveComponent rendered');
  return <div>{data}</div>;
});

// Use useMemo for expensive calculations
const MyComponent = ({ items }) => {
  const processedData = useMemo(() => {
    return items.map(item => item * 2).filter(item => item > 10);
  }, [items]);

  // Use useCallback for event handlers
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return (
    <div>
      <ExpensiveComponent data={processedData} />
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};`,
    'secure-api-keys-nodejs': `// Example: Secure API key management in Node.js
require('dotenv').config();

// Access API key from environment variables
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error('API key is not defined in environment variables');
}

// Use the API key in your application
const makeApiRequest = async () => {
  const response = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
};`,
    'dockerize-nodejs-app': `# Example: Dockerfile for Node.js application
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:16-alpine as production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]`,
    'implement-jwt-authentication': `// Example: JWT authentication in Node.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};`
  };

  return codeExamples[slug] || codeExamples['convert-curl-to-axios'];
};

export default async function KeywordPage({ params }: { params: { slug: string } }) {
  console.log('Params object:', params);
  const resolvedParams = await params;
  console.log('Resolved params:', resolvedParams);
  const slug = resolvedParams.slug;
  console.log('Current slug:', slug);
  console.log('Available slugs:', keywordsData.map(k => k.slug));
  const keyword = keywordsData.find((k) => k.slug === slug);
  console.log('Found keyword:', keyword);
  
  if (!keyword) {
    return <div className="container mx-auto py-12">Page not found: {slug}</div>;
  }

  const codeExample = getCodeExample(slug);

  // 生成随机数种子
  const getRandom = (seed: number, max: number) => {
    // 使用 seed 生成可复现的随机数
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  // 随机打乱模块顺序
  const shuffleSections = (seed: number) => {
    const sections = ['intro', 'linguistic', 'prediction', 'ai-smell', 'calculator', 'implementation', 'faq', 'problem', 'tool', 'guide', 'code'];
    const random = getRandom(seed, sections.length);
    // 根据 seed 对 sections 进行循环移位
    const shuffled = [...sections.slice(random), ...sections.slice(0, random)];
    return shuffled;
  };

  // 生成标题样式
  const getHeadingStyle = (seed: number, level: 'h2' | 'h3') => {
    const styleIndex = getRandom(seed, 2);
    return styleIndex === 0 ? 'plain' : 'icon';
  };

  // 随机生成 CTA 按钮文字
  const getCtaButtonText = (seed: number) => {
    const ctaTexts = ["Extract My DNA", "Lock My Persona", "Remove AI Taste", "Analyze My Style"];
    const index = getRandom(seed, ctaTexts.length);
    return ctaTexts[index];
  };

  // 生成 Metadata 标题
  const generateMetadataTitle = (keyword: any, seed: number) => {
    if (seed % 2 === 1) {
      return `${keyword.title} | PersonaLock`;
    } else {
      return `How to ${keyword.title} (2026 Guide)`;
    }
  };

  // 随机插入内容
  const getInjectedContent = (seed: number) => {
    const contentIndex = getRandom(seed, 2);
    if (contentIndex === 0) {
      // AI 写作避坑指南
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">AI 写作避坑指南</h3>
          <p className="text-yellow-700">
            1. 避免使用过于通用的词汇，如"非常"、"很"等。
            2. 注意保持内容的连贯性和逻辑性。
            3. 检查 AI 生成内容的事实准确性。
            4. 避免过度依赖 AI，保持自己的创作风格。
            5. 定期更新提示词，以获得更好的结果。
          </p>
        </div>
      );
    } else {
      // 用户真实反馈
      const feedbacks = [
        {
          name: 'John Doe',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          date: '2 days ago',
          content: 'This tool saved me hours of manual work. The generated code was clean and worked perfectly on the first try.'
        },
        {
          name: 'Jane Smith',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          date: '1 week ago',
          content: 'I was struggling with authentication implementation, but this guide made it so simple. Highly recommended!'
        },
        {
          name: 'Mike Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          date: '2 weeks ago',
          content: 'The performance optimization tips were exactly what I needed for my React app. Load times improved by 40%!'
        }
      ];
      const feedbackIndex = getRandom(seed, feedbacks.length);
      const feedback = feedbacks[feedbackIndex];
      return (
        <div className="bg-slate-50 border border-slate-200 p-4 mb-8 rounded-lg">
          <div className="flex items-center mb-2">
            <img src={feedback.avatar} alt={feedback.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
            <div>
              <p className="font-medium text-slate-900">{feedback.name}</p>
              <p className="text-sm text-slate-500">{feedback.date}</p>
            </div>
          </div>
          <p className="text-slate-600">{feedback.content}</p>
        </div>
      );
    }
  };

  // 生成相关链接
  const getRelatedLinks = (currentKeyword: any, keywords: any[]) => {
    // 过滤掉当前关键词
    const otherKeywords = keywords.filter(k => k.slug !== currentKeyword.slug);
    
    // 按 template_type 分组
    const sameTypeKeywords = otherKeywords.filter(k => k.template_type === currentKeyword.template_type);
    const differentTypeKeywords = otherKeywords.filter(k => k.template_type !== currentKeyword.template_type);
    
    // 优先选择同类型的关键词
    let relatedKeywords = [...sameTypeKeywords];
    
    // 如果同类型的关键词不足 3 个，添加不同类型的关键词
    if (relatedKeywords.length < 3) {
      const needed = 3 - relatedKeywords.length;
      relatedKeywords = [...relatedKeywords, ...differentTypeKeywords.slice(0, needed)];
    }
    
    // 随机排序并取前 3 个
    relatedKeywords.sort(() => Math.random() - 0.5);
    return relatedKeywords.slice(0, 3);
  };

  // 生成深度内容结构
  const generateDeepContent = (keyword: any) => {
    // 生成随机数种子
    const getRandom = (seed: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * max);
    };

    // 模块 A: Technical Deep-Dive 文案片段
    const technicalDeepDiveFragments = [
      `LLMs, often referred to as Stochastic Parrots, predict the next token by calculating the probability distribution over the entire vocabulary. This process, known as Logits Optimization, inherently favors the most statistically probable words and phrases, leading to a homogenization of tone. The Entropy of Style is significantly reduced as the model gravitates toward the mean of all training data, resulting in content that lacks the idiosyncrasies that make human expression unique.`,
      `The fundamental issue with LLMs is their token prediction mechanism. By design, they calculate the probability of each possible next token based on the context window, a process that naturally prioritizes common expressions over distinctive ones. This Logits Optimization process effectively flattens the Entropy of Style, creating content that feels generic and predictable—exactly what we mean by "AI smell."`,
      `When LLMs generate content, they're essentially playing a sophisticated game of probability. Each token is selected based on its likelihood within the context, which means the model will almost always choose the most statistically safe option. This Stochastic Parrots behavior, combined with aggressive Logits Optimization, results in a significant reduction of the Entropy of Style, making it nearly impossible for the model to maintain a consistent, distinctive voice.`
    ];

    // 模块 B: The 2026 Prediction 文案片段
    const prediction2026Fragments = [
      `By 2026, we'll reach a tipping point in AI content consumption—what I call the "Aesthetic Fatigue Era." As AI-generated content becomes ubiquitous, audiences will develop an innate ability to detect even the subtlest hints of machine generation. In this landscape, the only true premium asset will be "human touch"—the authentic, imperfect, and deeply personal elements that AI simply cannot replicate. Content creators who can preserve their unique voice will command significant premium over generic AI output.`,
      `2026 will mark the end of the AI novelty phase and the beginning of the Great Differentiation. As consumers grow weary of the sameness in AI-generated content, they'll increasingly seek out content with genuine human character. The market will reward creators who can maintain their distinctive voice, with "human味" becoming the most sought-after quality in digital content. This shift will create a new hierarchy where authentic expression commands premium pricing.`,
      `Looking ahead to 2026, we predict a radical shift in content valuation. As AI becomes capable of generating technically proficient content at scale, the market will undergo a paradigm shift—valuing human authenticity above all else. The era of AI aesthetic fatigue will make "人味" the ultimate differentiator, with brands and creators who can preserve their unique voice commanding significant price premiums over generic AI alternatives.`
    ];

    // 通用 SEO 补全段落
    const seoCompletionParagraphs = [
      `In today's competitive digital landscape, standing out from the crowd is more important than ever. With the rise of AI-generated content, maintaining a unique voice has become a critical differentiator. By leveraging tools like PersonaLock, you can ensure your content remains authentic and distinctive, even when using AI assistance.`,
      `Content creators face a unique challenge in the age of AI: how to harness the power of machine learning while preserving their individual voice. This balance is essential for building a loyal audience and establishing a strong personal brand. PersonaLock provides a solution by extracting your unique style DNA and injecting it into AI-generated content.`,
      `The key to successful content creation in 2026 is authenticity. As AI becomes more prevalent, audiences will increasingly value content that feels genuine and human. By using PersonaLock to maintain your unique voice, you can create content that resonates with your audience on a deeper level.`,
      `Search engines are evolving to prioritize content that provides genuine value and authenticity. By maintaining a consistent, distinctive voice in your content, you can improve your search rankings and attract more organic traffic. PersonaLock helps you achieve this by ensuring your AI-generated content reflects your unique style.`,
      `Building a strong personal brand requires consistency across all your content. Whether you're creating blog posts, social media updates, or marketing materials, maintaining a cohesive voice is essential. PersonaLock makes this easy by extracting your style DNA and applying it to all your AI-generated content.`,
      `The future of content creation lies in the balance between AI efficiency and human authenticity. By using tools like PersonaLock, you can leverage the speed and capabilities of AI while preserving the unique elements that make your content stand out. This approach will become increasingly important as AI continues to evolve.`,
      `Content that feels authentic and personal tends to perform better across all metrics—from engagement to conversion rates. By using PersonaLock to maintain your unique voice, you can create content that connects with your audience on an emotional level, driving better results for your business or personal brand.`,
      `In an era of information overload, content that stands out is content that feels human. By preserving your unique voice through tools like PersonaLock, you can cut through the noise and capture your audience's attention. This will become even more important as AI-generated content becomes more widespread.`,
      `The most successful content creators in 2026 will be those who can maintain their unique voice while leveraging AI tools. PersonaLock provides a competitive advantage by ensuring your AI-generated content remains authentic and distinctive, helping you build a loyal audience and establish yourself as an authority in your niche.`,
      `As AI technology continues to advance, the ability to create content that feels genuine and human will become a valuable skill. PersonaLock helps you develop this skill by extracting your unique style DNA and injecting it into all your AI-generated content, ensuring consistency and authenticity across all your digital presence.`
    ];

    // 根据 seed 随机选择文案片段
    const seed = keyword.seed;
    const technicalIndex = getRandom(seed, technicalDeepDiveFragments.length);
    const predictionIndex = getRandom(seed + 1, prediction2026Fragments.length);
    const seoIndex = getRandom(seed + 2, seoCompletionParagraphs.length);

    // Intro (100 words): 深度共情描述
    const intro = `If you've ever struggled with ${keyword.slug.replace('-', ' ')}, you know how frustrating it can be. The problem isn't just about finding a solution—it's about finding a solution that truly resonates with your unique creative voice. Many developers and content creators face this exact challenge, feeling like their AI-generated content lacks authenticity or fails to capture their distinctive style. This isn't just a minor inconvenience; it's a barrier to creating content that truly stands out in a crowded digital landscape.`;

    // Linguistic Analysis (200 words): 解释 LLM 失败原因
    const linguisticAnalysis = technicalDeepDiveFragments[technicalIndex];

    // 2026 Prediction 模块
    const prediction2026 = prediction2026Fragments[predictionIndex];

    // AI Smell Index Table 数据
    const aiSmellIndex = {
      examples: [
        {
          aiExpression: `To address ${keyword.slug.replace('-', ' ')}, you should consider various approaches and implement best practices.`,
          personaLockExpression: `When tackling ${keyword.slug.replace('-', ' ')}, I've found that focusing on your unique creative voice while implementing targeted strategies yields the best results.`
        },
        {
          aiExpression: `Many people find ${keyword.slug.replace('-', ' ')} to be challenging, but with the right tools, it can be manageable.`,
          personaLockExpression: `I know firsthand how frustrating ${keyword.slug.replace('-', ' ')} can be—you're not alone. The key is finding tools that adapt to your specific style, not the other way around.`
        },
        {
          aiExpression: `There are several methods to improve ${keyword.slug.replace('-', ' ')} that you might find helpful.`,
          personaLockExpression: `Through years of experimentation, I've developed a proven approach to ${keyword.slug.replace('-', ' ')} that preserves your creative identity while enhancing quality.`
        }
      ]
    };

    // Implementation Guide (200 words): 3 步提取指南
    const implementationGuide = `Step 1: Gather your reference material. Collect 3-5 examples of your best work that exemplify your unique style. These could be blog posts, social media updates, or any other content that truly represents your voice. Step 2: Use PersonaLock's extraction tool to analyze your reference material. Simply paste your content into the input field and click "Extract Style DNA." The tool will analyze your linguistic patterns, tone, and stylistic preferences. Step 3: Apply your Style DNA to your AI prompts. Copy the generated Style DNA and include it at the beginning of your prompts to any LLM. This will instruct the model to adapt its output to match your specific style, ensuring consistency across all generated content.`;

    // SEO FAQ (150 words): 3 个常见问题
    const seoFaq = {
      questions: [
        {
          question: `What is ${keyword.slug.replace('-', ' ')} and why is it important?`,
          answer: `${keyword.slug.replace('-', ' ')} refers to the process of optimizing AI-generated content to match your unique style. It's important because generic AI content often lacks personality and fails to connect with audiences in a meaningful way.`
        },
        {
          question: `How does PersonaLock help with ${keyword.slug.replace('-', ' ')}?`,
          answer: `PersonaLock extracts your unique style DNA from your existing content, then provides a structured prompt that instructs LLMs to mimic your specific linguistic patterns, tone, and stylistic preferences.`
        },
        {
          question: `Can I use PersonaLock for multiple content types?`,
          answer: `Yes, PersonaLock is versatile and can be used for various content types, including blog posts, social media updates, emails, and more. Simply extract your Style DNA once and apply it to all your AI prompts.`
        }
      ]
    };

    // 自动填充：如果核心描述过短，添加 SEO 补全段落
    let seoCompletion = '';
    if ((keyword.problem_description || '').length < 100) {
      seoCompletion = seoCompletionParagraphs[seoIndex];
    }

    return {
      intro,
      linguisticAnalysis,
      prediction2026,
      aiSmellIndex,
      implementationGuide,
      seoFaq,
      seoCompletion
    };
  };

  // 根据 template_type 选择布局
  const renderLayout = () => {
    const shuffledSections = shuffleSections(keyword.seed);
    const headingStyle = getHeadingStyle(keyword.seed, 'h2');
    const injectedContent = getInjectedContent(keyword.seed);
    const ctaButtonText = getCtaButtonText(keyword.seed);
    const relatedLinks = getRelatedLinks(keyword, keywordsData);
    const deepContent = generateDeepContent(keyword);

    switch (keyword.template_type) {
      case 'CLICHE_KILLER':
        return <Layout_A 
          keyword={keyword} 
          codeExample={codeExample} 
          shuffledSections={shuffledSections}
          headingStyle={headingStyle}
          injectedContent={injectedContent}
          ctaButtonText={ctaButtonText}
          relatedLinks={relatedLinks}
          deepContent={deepContent}
        />;
      case 'IDENTITY_LOCK':
        return <Layout_B 
          keyword={keyword} 
          codeExample={codeExample} 
          shuffledSections={shuffledSections}
          headingStyle={headingStyle}
          injectedContent={injectedContent}
          ctaButtonText={ctaButtonText}
          relatedLinks={relatedLinks}
          deepContent={deepContent}
        />;
      case 'PLATFORM_ADAPTOR':
        return <Layout_C 
          keyword={keyword} 
          codeExample={codeExample} 
          shuffledSections={shuffledSections}
          headingStyle={headingStyle}
          injectedContent={injectedContent}
          ctaButtonText={ctaButtonText}
          relatedLinks={relatedLinks}
          deepContent={deepContent}
        />;
      case 'GENERAL_FIX':
        return <Layout_D 
          keyword={keyword} 
          codeExample={codeExample} 
          shuffledSections={shuffledSections}
          headingStyle={headingStyle}
          injectedContent={injectedContent}
          ctaButtonText={ctaButtonText}
          relatedLinks={relatedLinks}
          deepContent={deepContent}
        />;
      default:
        return <Layout_D 
          keyword={keyword} 
          codeExample={codeExample} 
          shuffledSections={shuffledSections}
          headingStyle={headingStyle}
          injectedContent={injectedContent}
          ctaButtonText={ctaButtonText}
          relatedLinks={relatedLinks}
          deepContent={deepContent}
        />;
    }
  };

  return renderLayout();
}