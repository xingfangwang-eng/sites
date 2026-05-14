const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 修复语法错误
const fixedContent = content
    // 修复三元运算符缺少的 ?
    .replace(/statusCode >= 400\)\)  originalStatusCode/g, 'statusCode >= 400)) ? originalStatusCode')
    .replace(/error\.name === 'AbortError'  'timeout'/g, "error.name === 'AbortError' ? 'timeout'")
    .replace(/latency > timeoutValue  timeoutValue/g, 'latency > timeoutValue ? timeoutValue')
    // 修复模板字符串缺少的 $
    .replace(/\{retryCount - attempt/g, '${retryCount - attempt')
    // 修复多余的 }
    .replace(/\$\{retryCount\}\}/g, '${retryCount})')
    // 修复其他可能的问题
    .replace(/consork'/g, "console.log('")
    .replace(/\}\s*'timeout'/g, "} ? 'timeout'")
    .replace(/timeoutValue : latency\;/g, 'timeoutValue : latency;');

// 写入文件
fs.writeFileSync('script.js', fixedContent, 'utf8');

console.log('Fixed syntax errors in script.js');
