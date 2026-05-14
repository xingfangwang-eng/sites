const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 修复代码生成模板中的问题
const fixedContent = content
    // 修复三元运算符缺少的 ?
    .replace(/timeoutEnabled  timeoutValue/g, 'timeoutEnabled ? timeoutValue')
    .replace(/timeoutEnabled \$\{timeoutValue/g, 'timeoutEnabled ? ${timeoutValue}')
    // 修复代码生成模板中缺少 $ 的模板表达式
    .replace(/\{url \|\|/g, '${url ||')
    .replace(/\{method\}/g, '${method}')
    .replace(/\{headersString\}/g, '${headersString}')
    .replace(/\{bodyString\}/g, '${bodyString}')
    .replace(/\{timeoutValue\}/g, '${timeoutValue}')
    // 修复嵌套的模板字符串问题
    .replace(/\\\`/g, '\\\\`')
    // 修复语法错误
    .replace(/headers: \{[\s\S]*?\}\s*\);/g, (match) => {
        // 修复 axios 配置中的括号问题
        return match.replace(/\}\s*\);/, '} };');
    });

// 写入文件
fs.writeFileSync('script.js', fixedContent, 'utf8');

console.log('Fixed all issues in script.js');
