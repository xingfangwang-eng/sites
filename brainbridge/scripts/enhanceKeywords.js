const fs = require('fs');
const path = require('path');

// 读取 keywords.json 文件
const keywordsPath = path.join(__dirname, '..', 'data', 'keywords.json');
const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

// 定义可能的分类
const categories = ['Developer', 'Writer', 'Researcher', 'Student'];

// 定义可能的用户抱怨
const userQuotes = [
  'My backticks are all over the place!',
  'Why does copying from AI always break my code?',
  'I spend more time formatting than coding!',
  'Switching between AI tools is killing my productivity.',
  'I wish I could just drag context between AIs.',
  'My AI chat history is a mess of lost ideas.',
  'Copy-paste from AI never works right the first time.',
  'I need a better way to organize my AI snippets.',
  'Why can\'t my AI tools remember what I just talked about?',
  'The markdown formatting from AI is driving me crazy.',
  'I\'m tired of retyping the same instructions to every AI.',
  'My code always has weird characters when I paste from AI.',
  'I lose my train of thought when switching between AI tabs.',
  'I need a universal clipboard for all my AI tools.',
  'Why does AI code always have syntax errors when I paste it?',
  'I wish I could save my best AI prompts for later.',
  'Switching between different AI models is too much work.',
  'I need a way to sync my AI research across devices.',
  'The context window in AI tools is too limited.',
  'I\'m tired of tab hunting for my AI conversations.'
];

// 定义可能的关联 AI 工具
const aiTools = ['Claude', 'Cursor', 'VSCode', 'ChatGPT', 'Perplexity', 'DeepSeek', 'Gemini', 'Midjourney', 'Ollama', 'LM Studio'];

// 为每个关键词对象添加新字段
const enhancedKeywords = keywordsData.map(keyword => {
  // 随机选择分类
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // 随机生成难度（1-5）
  const difficulty = Math.floor(Math.random() * 5) + 1;
  
  // 随机选择用户抱怨
  const userQuote = userQuotes[Math.floor(Math.random() * userQuotes.length)];
  
  // 随机生成布局种子（1-4）
  const layoutSeed = Math.floor(Math.random() * 4) + 1;
  
  // 随机选择 2-4 个关联工具
  const numTools = Math.floor(Math.random() * 3) + 2;
  const shuffledTools = [...aiTools].sort(() => 0.5 - Math.random());
  const relatedTools = shuffledTools.slice(0, numTools);
  
  return {
    ...keyword,
    category,
    difficulty,
    user_quote: userQuote,
    layout_seed: layoutSeed,
    related_tools: relatedTools
  };
});

// 写回增强后的 JSON 文件
fs.writeFileSync(keywordsPath, JSON.stringify(enhancedKeywords, null, 2), 'utf8');

console.log('Keywords enhanced successfully!');
console.log(`Processed ${enhancedKeywords.length} keywords`);
