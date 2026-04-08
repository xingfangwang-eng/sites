import { ChevronRight } from "lucide-react";
import { categorizeKeyword } from "@/lib/content-enhancer";

interface Keyword {
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
}

interface RelatedSolutionsProps {
  currentKeyword: Keyword;
  allKeywords: Keyword[];
}

export default function RelatedSolutions({ currentKeyword, allKeywords }: RelatedSolutionsProps) {
  const currentCategory = categorizeKeyword(currentKeyword);
  
  // Filter out current keyword
  const otherKeywords = allKeywords.filter(k => k.slug !== currentKeyword.slug);
  
  // Get same category keywords
  const sameCategoryKeywords = otherKeywords.filter(k => categorizeKeyword(k) === currentCategory);
  
  // Get cross category keywords
  const crossCategoryKeywords = otherKeywords.filter(k => categorizeKeyword(k) !== currentCategory);
  
  // Select 2 same category keywords (or fewer if not enough)
  const selectedSameCategory = sameCategoryKeywords.slice(0, 2);
  
  // Select 1 cross category keyword (if available)
  let selectedCrossCategory: Keyword[] = [];
  if (crossCategoryKeywords.length > 0) {
    const randomIndex = Math.floor(Math.random() * crossCategoryKeywords.length);
    selectedCrossCategory = [crossCategoryKeywords[randomIndex]];
  }
  
  // Combine all related keywords
  const relatedKeywords = [...selectedSameCategory, ...selectedCrossCategory];
  
  // Generate anchor text for each keyword
  const generateAnchorText = (keyword: Keyword) => {
    const variations = [
      `How to solve ${keyword.title.toLowerCase()}`,
      `Guide to ${keyword.title.toLowerCase()}`,
      `Learn how to ${keyword.title.toLowerCase()}`,
      `Solution for ${keyword.title.toLowerCase()}`
    ];
    
    // Generate deterministic index based on slug
    const index = Math.abs(keyword.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % variations.length;
    return variations[index];
  };
  
  if (relatedKeywords.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white border border-slate-200 p-8 mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <div className="w-1 bg-red-600 h-8 mr-4"></div>
        Related Solutions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedKeywords.map((keyword, index) => (
          <div key={keyword.slug} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              {index + 1}. {keyword.title}
            </h3>
            <p className="text-slate-600 mb-4 line-clamp-2">
              {keyword.problem_description.substring(0, 100)}...
            </p>
            <a 
              href={`/${keyword.slug}`}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              {generateAnchorText(keyword)}
              <ChevronRight size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
