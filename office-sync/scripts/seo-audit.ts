import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 keywords.json 文件
const keywordsPath = path.join(__dirname, '..', 'data', 'keywords.json');
const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

// 生成所有页面的 URL
const baseUrl = 'http://localhost:3002';
const urls = keywords.map((keyword: any) => `${baseUrl}/solutions/${keyword.slug}`);

// 简单的文本预处理函数
function preprocessText(text: string): string {
  // 移除 HTML 标签
  const cleanText = text.replace(/<[^>]*>/g, '');
  // 转换为小写
  const lowercaseText = cleanText.toLowerCase();
  // 移除标点符号
  const noPunctuationText = lowercaseText.replace(/[.,#!$%\^&\*;:{}=\-_`~()]/g, '');
  // 分割为单词
  return noPunctuationText;
}

// 计算词频
function calculateWordFrequency(text: string): Record<string, number> {
  const words = text.split(/\s+/).filter(word => word.length > 2); // 过滤短词
  const frequency: Record<string, number> = {};
  
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }
  
  return frequency;
}

// 计算余弦相似度
function calculateCosineSimilarity(freq1: Record<string, number>, freq2: Record<string, number>): number {
  // 获取所有唯一单词
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  // 计算点积
  let dotProduct = 0;
  for (const word of allWords) {
    dotProduct += (freq1[word] || 0) * (freq2[word] || 0);
  }
  
  // 计算向量长度
  let magnitude1 = 0;
  for (const count of Object.values(freq1)) {
    magnitude1 += count * count;
  }
  magnitude1 = Math.sqrt(magnitude1);
  
  let magnitude2 = 0;
  for (const count of Object.values(freq2)) {
    magnitude2 += count * count;
  }
  magnitude2 = Math.sqrt(magnitude2);
  
  // 计算余弦相似度
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

// 主函数
async function runSEOAudit() {
  console.log('Starting SEO audit...');
  console.log(`Total pages to audit: ${urls.length}`);
  console.log('='.repeat(80));
  
  // 存储每个页面的内容
  const pageContents: string[] = [];
  
  // 抓取所有页面内容
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Fetching page ${i + 1}/${urls.length}: ${url}`);
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        const content = await response.text();
        pageContents.push(content);
      } else {
        console.error(`Failed to fetch ${url}: ${response.status}`);
        pageContents.push('');
      }
    } catch (error) {
      console.error(`Error fetching ${url}: ${error}`);
      pageContents.push('');
    }
  }
  
  console.log('='.repeat(80));
  console.log('Analyzing text similarity...');
  console.log('='.repeat(80));
  
  // 检查所有页面对的相似度
  const highSimilarityPages: Array<{ page1: string; page2: string; similarity: number }> = [];
  
  for (let i = 0; i < pageContents.length; i++) {
    for (let j = i + 1; j < pageContents.length; j++) {
      const content1 = pageContents[i];
      const content2 = pageContents[j];
      
      if (!content1 || !content2) {
        continue;
      }
      
      // 预处理文本
      const processedText1 = preprocessText(content1);
      const processedText2 = preprocessText(content2);
      
      // 计算词频
      const freq1 = calculateWordFrequency(processedText1);
      const freq2 = calculateWordFrequency(processedText2);
      
      // 计算相似度
      const similarity = calculateCosineSimilarity(freq1, freq2);
      
      // 检查相似度是否超过 60%
      if (similarity > 0.6) {
        highSimilarityPages.push({
          page1: urls[i],
          page2: urls[j],
          similarity: similarity * 100
        });
      }
    }
  }
  
  // 输出结果
  if (highSimilarityPages.length > 0) {
    console.error('ERROR: High similarity pages found!');
    console.error('='.repeat(80));
    for (const item of highSimilarityPages) {
      console.error(`Similarity: ${item.similarity.toFixed(2)}%`);
      console.error(`Page 1: ${item.page1}`);
      console.error(`Page 2: ${item.page2}`);
      console.error('-' .repeat(80));
    }
    console.error('These pages need more varied content to avoid being flagged as duplicate by search engines.');
  } else {
    console.log('SUCCESS: No high similarity pages found!');
    console.log('All pages have sufficient unique content.');
  }
  
  console.log('='.repeat(80));
  console.log('SEO audit completed.');
}

// 运行审计
runSEOAudit().catch(console.error);