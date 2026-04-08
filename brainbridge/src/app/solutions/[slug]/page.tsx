import { Metadata, ResolvingMetadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SolutionPageClient } from './SolutionPageClient';

// Read keywords.json file
const keywordsData = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'keywords.json'), 'utf8')
);

// Difficulty modifiers
const difficultyModifiers = {
  1: 'Simple Fix',
  2: 'Easy Solution',
  3: 'Step-by-Step Guide',
  4: 'Advanced Method',
  5: 'Expert Guide'
};

// Random padding values
const paddingValues = ['py-16', 'py-20', 'py-24'];

// Random gap values
const gapValues = ['gap-8', 'gap-10', 'gap-12'];

// Generate random style classes
function getRandomStyles() {
  return {
    padding: paddingValues[Math.floor(Math.random() * paddingValues.length)],
    gap: gapValues[Math.floor(Math.random() * gapValues.length)]
  };
}

// Get button text based on category
function getButtonText(category: string) {
  const buttonTexts = {
    Developer: [
      'Boost My Code',
      'Optimize My Workflow',
      'Supercharge My Development',
      'Level Up My Coding'
    ],
    Writer: [
      'Enhance My Writing',
      'Streamline My Content',
      'Elevate My Words',
      'Boost My Creativity'
    ],
    Researcher: [
      'Save My Research',
      'Organize My Findings',
      'Accelerate My Analysis',
      'Optimize My Research'
    ],
    Student: [
      'Improve My Studies',
      'Enhance My Learning',
      'Boost My Academic Performance',
      'Simplify My Homework'
    ]
  };
  
  const texts = buttonTexts[category as keyof typeof buttonTexts] || buttonTexts.Developer;
  // Use deterministic index based on category length to avoid hydration mismatch
  const index = category.length % texts.length;
  return texts[index];
}

// Generate FAQ based on keyword
function generateFAQ(keyword: string) {
  const faqTemplates = [
    {
      question: `How does BrainBridge help with ${keyword}?`,
      answer: `BrainBridge helps with ${keyword} by providing a seamless way to capture, organize, and transfer context between different AI tools. It eliminates the need for manual copy-pasting and ensures your work remains consistent across platforms.`
    },
    {
      question: `Is BrainBridge compatible with all AI tools?`,
      answer: `BrainBridge is designed to work with most major AI tools including Claude, ChatGPT, Cursor, and more. Its universal API allows for easy integration with any tool that supports clipboard operations or API access.`
    },
    {
      question: `What makes BrainBridge different from other similar tools?`,
      answer: `BrainBridge stands out with its one-click memory capture, real-time syncing, and clean code extraction capabilities. It's specifically designed for developers and AI power users who need to move seamlessly between different AI platforms.`
    },
    {
      question: `How secure is my data with BrainBridge?`,
      answer: `BrainBridge takes security seriously. All your data is encrypted and stored securely. You have full control over your memories and can delete them at any time. We never share your data with third parties.`
    },
    {
      question: `Can I use BrainBridge across multiple devices?`,
      answer: `Yes, BrainBridge syncs your memories across all your devices. Whether you're working on your desktop, laptop, or tablet, you'll have access to your entire memory library.`
    }
  ];
  
  // Use deterministic shuffling based on keyword length to avoid hydration mismatch
  const shuffled = [...faqTemplates].sort((a, b) => {
    const hashA = a.question.length + keyword.length;
    const hashB = b.question.length + keyword.length;
    return hashA - hashB;
  });
  
  return shuffled.slice(0, 3);
}

// Generate page metadata
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const keyword = keywordsData.find((item: any) => item.slug === slug);
  
  if (!keyword) {
    return {
      title: 'BrainBridge - AI Memory Management',
      description: 'Bridge the gap between your AI tools with BrainBridge',
    };
  }
  
  const difficultyModifier = difficultyModifiers[keyword.difficulty as keyof typeof difficultyModifiers] || '';
  
  return {
    title: `${keyword.title} - ${difficultyModifier} | BrainBridge`,
    description: `${keyword.problem_description} ${difficultyModifier} with BrainBridge. ${keyword.how_to_solve.substring(0, 120)}...`,
    keywords: [keyword.keyword, 'AI memory', 'BrainBridge', 'context sync'],
    openGraph: {
      title: `${keyword.title} - ${difficultyModifier}`,
      description: `${keyword.problem_description} ${difficultyModifier} with BrainBridge`,
      type: 'article',
      url: `https://brainbridge.so/solutions/${keyword.slug}`,
    },
  };
}

// Generate static paths
export async function generateStaticParams() {
  return keywordsData.map((item: any) => ({
    slug: item.slug,
  }));
}

// Main page component
export default async function SolutionPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const keyword = keywordsData.find((item: any) => item.slug === slug);
  
  if (!keyword) {
    return (
      <div className="max-w-7xl mx-auto my-12 px-6">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-8">
          Page Not Found
        </h1>
        <p className="text-lg text-slate-600">
          The requested page could not be found.
        </p>
      </div>
    );
  }
  
  const randomStyles = getRandomStyles();
  const buttonText = getButtonText(keyword.category);
  const faqItems = generateFAQ(keyword.title);
  
  return (
    <SolutionPageClient keyword={keyword} randomStyles={randomStyles} buttonText={buttonText} faqItems={faqItems} />
  );
}
