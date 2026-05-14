const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 修复模板字符串错误
const fixedContent = content
    // 修复模板字符串中的表达式缺少闭合 }
    .replace(/\{retryCount - attempt \+ 1\}/g, '${retryCount - attempt + 1}')
    .replace(/\{retryCount \- attempt \+ 1\}/g, '${retryCount - attempt + 1}')
    .replace(/\{retryCount\}/g, '${retryCount}')
    // 修复其他可能的模板字符串问题
    .replace(/\{\{retryCount/g, '${retryCount')
    .replace(/\}\}/g, '}');

// 写入文件
fs.writeFileSync('script.js', fixedContent, 'utf8');

console.log('Fixed template string errors in script.js');
