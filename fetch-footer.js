const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://oneclickapi.wangdadi.xyz/';

function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractFooterContent(html) {
  // 提取包含页脚内容的完整部分（从Terms链接开始到支持邮箱结束）
  const footerMatch = html.match(/<div[^>]*class="flex flex-wrap justify-center gap-6 mb-8"[^>]*>.*?Support:.*?<\/div>/s);
  if (footerMatch) {
    return footerMatch[0];
  }
  
  // 尝试提取更大范围的内容
  const largerMatch = html.match(/<div[^>]*mt-16 max-w-2xl mx-auto[^>]*>.*?<\/div>/s);
  if (largerMatch) {
    return largerMatch[0];
  }
  
  return null;
}

function updateSharedFooter(footerContent) {
  const footerPath = path.join(__dirname, 'shared-footer.js');
  
  const footerScript = `class SharedFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`
      ${footerContent}
    \`;
  }
}

if (!customElements.get('shared-footer')) {
  customElements.define('shared-footer', SharedFooter);
}
`;
  
  fs.writeFileSync(footerPath, footerScript, 'utf-8');
  console.log('✓ 已更新 shared-footer.js');
}

async function main() {
  try {
    console.log('正在抓取 https://oneclickapi.wangdadi.xyz/ 的页脚内容...');
    const html = await fetchPageContent(url);
    
    console.log('正在提取页脚内容...');
    const footerContent = extractFooterContent(html);
    
    if (footerContent) {
      console.log('找到页脚内容，正在更新 shared-footer.js...');
      updateSharedFooter(footerContent);
      console.log('任务完成！');
    } else {
      console.log('未找到页脚内容，请检查网页结构是否已变化。');
    }
  } catch (error) {
    console.error('抓取过程中出错:', error.message);
  }
}

main();
