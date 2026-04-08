const fs = require('fs');
const path = require('path');
const keywords = require('../data/keywords.json');

// 模拟浏览器环境，用于渲染 React 组件
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;
global.document = window.document;
global.navigator = window.navigator;

// 计算文本的单词数
function countWords(text) {
  // 移除 HTML 标签
  const plainText = text.replace(/<[^>]*>/g, '');
  // 分割单词并过滤空字符串
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

// 计算两个字符串的相似度（基于 Levenshtein 距离）
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  
  // 创建矩阵
  const matrix = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [];
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else if (j === 0) {
        matrix[i][j] = i;
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1),
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1
        );
      }
    }
  }
  
  // 计算相似度
  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  const similarity = (1 - distance / maxLength) * 100;
  return similarity;
}

// 模拟渲染页面并获取 HTML
function renderPage(slug) {
  // 这里我们模拟渲染，实际项目中可能需要使用 Next.js 的渲染机制
  // 为了简化，我们创建一个模拟的 HTML 结构
  const keyword = keywords.find(item => item.slug === slug);
  if (!keyword) {
    return '';
  }
  
  // 模拟页面内容
  const html = `
    <div>
      <h1>${keyword.title}</h1>
      <p>As a ${keyword.persona} in the ${keyword.industry_context} industry, you're no stranger to the constant pressure to perform. The ${keyword.technical_hurdle} makes it nearly impossible to take a mental break without risking your job. You're trapped in a cycle of constant productivity monitoring, with little to no time for the activities that bring you joy. But what if there was a way to reclaim your time without getting caught? A way to enjoy your favorite games while still appearing fully engaged at work?</p>
      <p>Wondering how much value you could gain from stealth gaming? Use our calculator to estimate the financial value of your gamed time and the mental health benefits of taking strategic breaks. Adjust the inputs to see how different scenarios impact your potential ROI.</p>
      <div class="calculator">Calculator goes here</div>
      <p>StealthPlay uses advanced technology to bypass monitoring systems. It operates at the application layer, avoiding detection by most endpoint security solutions. It doesn't modify system files or registry settings, leaving no trace that could be picked up by security scanners.</p>
      <table class="comparison-table">
        <tr><th>Solution</th><th>Risk Level</th><th>Bandwidth Signature</th><th>CPU Footprint</th><th>Boss-Key Latency</th><th>IT Audit Trail</th></tr>
        <tr><td>Traditional Cloud Gaming</td><td>High Risk</td><td>95</td><td>85</td><td>70</td><td>90</td></tr>
        <tr><td>VPN/Incognito</td><td>Detectable</td><td>75</td><td>60</td><td>45</td><td>65</td></tr>
        <tr><td>StealthPlay</td><td>0 Risk</td><td>15</td><td>20</td><td>10</td><td>5</td></tr>
      </table>
      <p>Meet Sarah, a ${keyword.persona} at a ${keyword.industry_context} company. She was struggling with burnout from long hours and constant monitoring. After implementing StealthPlay, she now enjoys 5 hours of gaming per week during work hours, reclaiming valuable mental health time. Her productivity has actually increased by 15% due to improved focus and reduced stress. Sarah's manager recently praised her for her "consistent performance" and "excellent time management."</p>
      <div class="faq">
        <h3>How does StealthPlay handle sudden desktop checks?</h3>
        <p>StealthPlay's boss-key functionality activates instantly, switching from gaming to a realistic work application interface in under 100ms. The transition is seamless, with no visual glitches or lag that could arouse suspicion.</p>
        <h3>What happens if my IT department runs a network scan?</h3>
        <p>StealthPlay encrypts all gaming traffic to appear as legitimate work-related communications. It uses the same protocols and port numbers as common business applications, making it virtually indistinguishable from normal network activity.</p>
        <h3>Can StealthPlay be detected by endpoint security software?</h3>
        <p>StealthPlay operates at the application layer, avoiding detection by most endpoint security solutions. It doesn't modify system files or registry settings, leaving no trace that could be picked up by security scanners.</p>
        <h3>How does StealthPlay handle screen recording software?</h3>
        <p>StealthPlay detects when screen recording software is active and automatically adjusts its visual output to match the expected work application interface, ensuring that any recorded footage appears completely legitimate.</p>
        <h3>What if my company uses keystroke logging?</h3>
        <p>StealthPlay's keystroke pattern mimicry technology generates natural typing patterns that match your normal work behavior, making it impossible for keystroke logging software to detect gaming activity.</p>
      </div>
      <div class="cta">
        <h2>Ready to Reclaim Your Time?</h2>
        <p>Join thousands of professionals who are using StealthPlay to enjoy gaming during work hours without getting caught.</p>
        <a href="https://www.paypal.com/paypalme/xingfangwang" target="_blank" rel="noopener noreferrer">Subscribe Now via PayPal</a>
        <p>PayPal Email: xingfang.wang@gmail.com</p>
      </div>
    </div>
  `;
  
  return html;
}

// 主测试函数
async function runTests() {
  console.log('Starting word count and similarity tests...');
  
  const pages = [];
  let errors = [];
  
  // 处理每个关键词
  for (const keyword of keywords) {
    const slug = keyword.slug;
    const html = renderPage(slug);
    const wordCount = countWords(html);
    
    // 检查单词数
    if (wordCount < 800) {
      errors.push(`Page ${slug} has only ${wordCount} words, which is less than 800.`);
    }
    
    pages.push({ slug, html, wordCount });
    console.log(`Processed ${slug}: ${wordCount} words`);
  }
  
  // 检查页面之间的相似度
  console.log('Checking page similarity...');
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const similarity = calculateSimilarity(pages[i].html, pages[j].html);
      if (similarity > 50) {
        errors.push(`Pages ${pages[i].slug} and ${pages[j].slug} have ${similarity.toFixed(2)}% similarity, which exceeds 50%.`);
      }
    }
  }
  
  // 输出结果
  console.log('\nTest Results:');
  if (errors.length === 0) {
    console.log('All pages passed the tests!');
  } else {
    console.log(`Found ${errors.length} errors:`);
    errors.forEach(error => console.log(`- ${error}`));
    process.exit(1); // 抛出异常
  }
}

// 运行测试
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
