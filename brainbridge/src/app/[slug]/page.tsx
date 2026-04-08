import { Metadata, ResolvingMetadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientComponent from './ClientComponent';

// Read keywords.json file
const keywordsData = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'keywords.json'), 'utf8')
);

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
  
  return {
    title: keyword.title,
    description: keyword.problem_description,
    keywords: [keyword.keyword, 'AI memory', 'BrainBridge', 'context sync'],
    openGraph: {
      title: keyword.title,
      description: keyword.problem_description,
      type: 'article',
      url: `https://brainbridge.so/${keyword.slug}`,
    },
  };
}

// Generate static paths
export async function generateStaticParams() {
  return keywordsData.map((item: any) => ({
    slug: item.slug,
  }));
}

// Link prefixes
const linkPrefixes = [
  'Read also:',
  'Found this useful? Check out:',
  'Related workflow:',
  'Similar solutions:',
  'Explore more:',
  'Other helpful resources:'
];

// Get random link prefix
function getRandomLinkPrefix() {
  return linkPrefixes[Math.floor(Math.random() * linkPrefixes.length)];
}

// Calculate tool overlap score
function calculateOverlapScore(currentTools: string[], otherTools: string[]) {
  const intersection = currentTools.filter(tool => otherTools.includes(tool));
  return intersection.length;
}

// Get related keywords
function getRelatedKeywords(currentKeyword: any, allKeywords: any[]) {
  return allKeywords
    .filter(keyword => keyword.slug !== currentKeyword.slug)
    .map(keyword => ({
      ...keyword,
      score: calculateOverlapScore(currentKeyword.related_tools, keyword.related_tools)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

// Server component
export default async function DetailPage({ params }: { params: { slug: string } }) {
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
  
  const relatedKeywords = getRelatedKeywords(keyword, keywordsData);
  const linkPrefix = getRandomLinkPrefix();
  
  return (
    <ClientComponent 
      keyword={keyword} 
      relatedKeywords={relatedKeywords} 
      linkPrefix={linkPrefix} 
    />
  );
}
