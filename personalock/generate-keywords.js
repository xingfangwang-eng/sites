const baseKeywords = [
  "convert-curl-to-axios",
  "optimize-react-app-performance",
  "secure-api-keys-nodejs",
  "dockerize-nodejs-app",
  "implement-jwt-authentication",
  "stop-using-bad-ai-prompts",
  "ban-cliche-phrases-ai",
  "make-ai-sound-like-me",
  "create-persona-for-ai",
  "adapt-ai-content-for-linkedin",
  "optimize-ai-posts-for-twitter",
  "format-ai-content-for-reddit",
  "improve-ai-code-quality",
  "fix-ai-generated-errors",
  "enhance-ai-writing-style",
  "optimize-ai-image-prompts",
  "improve-ai-translations",
  "fix-ai-grammar-mistakes",
  "enhance-ai-creativity",
  "optimize-ai-research-results",
  "stop-ai-hallucinations",
  "ban-ai-plagiarism",
  "make-ai-sound-like-expert",
  "create-brand-persona-ai",
  "adapt-ai-content-for-facebook",
  "optimize-ai-posts-for-instagram",
  "format-ai-content-for-medium",
  "improve-ai-email-writing",
  "fix-ai-spelling-errors",
  "enhance-ai-storytelling",
  "optimize-ai-marketing-content",
  "improve-ai-product-descriptions",
  "fix-ai-logic-errors",
  "enhance-ai-customer-support",
  "optimize-ai-social-media-content",
  "stop-ai-generic-responses",
  "ban-ai-spam-content",
  "make-ai-sound-like-celebrity",
  "create-character-persona-ai",
  "adapt-ai-content-for-youtube",
  "optimize-ai-posts-for-tiktok",
  "format-ai-content-for-substack",
  "improve-ai-technical-writing",
  "fix-ai-factual-errors",
  "enhance-ai-poetry-writing",
  "optimize-ai-sales-content",
  "improve-ai-resume-writing",
  "fix-ai-syntax-errors",
  "enhance-ai-podcast-scripts",
  "optimize-ai-educational-content",
  "stop-ai-biased-responses",
  "ban-ai-hate-speech",
  "make-ai-sound-like-historian",
  "create-professional-persona-ai",
  "adapt-ai-content-for-pinterest",
  "optimize-ai-posts-for-snapchat",
  "format-ai-content-for-quora",
  "improve-ai-blog-writing",
  "fix-ai-mathematical-errors",
  "enhance-ai-screenplay-writing",
  "optimize-ai-ad-copy",
  "improve-ai-cover-letters",
  "fix-ai-semantic-errors",
  "enhance-ai-speech-writing",
  "optimize-ai-training-materials",
  "stop-ai-redundant-content",
  "ban-ai-misinformation",
  "make-ai-sound-like-scientist",
  "create-creative-persona-ai",
  "adapt-ai-content-for-linkedin-articles",
  "optimize-ai-posts-for-twitter-threads",
  "format-ai-content-for-reddit-posts",
  "improve-ai-script-writing",
  "fix-ai-statistical-errors",
  "enhance-ai-lyric-writing",
  "optimize-ai-product-reviews",
  "improve-ai-recommendation-letters",
  "fix-ai-punctuation-errors",
  "enhance-ai-presentation-writing",
  "optimize-ai-onboarding-materials",
  "stop-ai-offensive-content",
  "ban-ai-scam-content",
  "make-ai-sound-like-writer",
  "create-business-persona-ai",
  "adapt-ai-content-for-linkedin-posts",
  "optimize-ai-posts-for-twitter-cards",
  "format-ai-content-for-reddit-comments",
  "improve-ai-email-newsletters",
  "fix-ai-contextual-errors",
  "enhance-ai-dialogue-writing",
  "optimize-ai-case-studies",
  "fix-ai-logical-errors",
  "enhance-ai-business-writing",
  "optimize-ai-content-strategy",
  "improve-ai-customer-engagement",
  "fix-ai-repetitive-content",
  "enhance-ai-brand-voice",
  "fix-ai-consistency-issues",
  "enhance-ai-narrative-flow",
  "optimize-ai-content-structure"
];

console.log('Base keywords length:', baseKeywords.length);

const keywordsData = baseKeywords.map((slug, index) => {
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ': A Complete Guide';
  const problem_description = `Many developers struggle with ${slug.replace('-', ' ')} issues, especially when dealing with complex scenarios and edge cases. This is a common problem that affects developers of all skill levels.`;
  const how_to_solve = `Our tool simplifies this process by automatically analyzing ${slug.replace('-', ' ')} and providing actionable solutions. Just input your requirements, and we'll handle the rest, including proper formatting, error handling, and optimization.`;
  
  let template_type = 'GENERAL_FIX';
  if (slug.includes('stop') || slug.includes('ban')) {
    template_type = 'CLICHE_KILLER';
  } else if (slug.includes('make-ai-sound-like') || slug.includes('persona')) {
    template_type = 'IDENTITY_LOCK';
  } else if (slug.includes('linkedin') || slug.includes('twitter') || slug.includes('reddit') || slug.includes('facebook') || slug.includes('instagram') || slug.includes('medium') || slug.includes('youtube') || slug.includes('tiktok') || slug.includes('substack') || slug.includes('pinterest') || slug.includes('snapchat') || slug.includes('quora')) {
    template_type = 'PLATFORM_ADAPTOR';
  }
  
  const seed = Math.floor(Math.random() * 10) + 1;
  
  return {
    slug,
    title,
    problem_description,
    how_to_solve,
    template_type,
    seed
  };
});

console.log('Generated keywordsData length:', keywordsData.length);

const fs = require('fs');
fs.writeFileSync('data/keywords.json', JSON.stringify(keywordsData, null, 2));
console.log('Successfully wrote keywords.json');
