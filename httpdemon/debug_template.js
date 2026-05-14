const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 查找所有模板字符串
const templateRegex = /`([^`]+)`/g;
let match;
let lineNumber = 0;

console.log('Found template strings:');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.includes('`')) {
        const lineMatches = line.match(templateRegex);
        if (lineMatches) {
            lineMatches.forEach((template) => {
                // 检查是否有不匹配的花括号
                const openCount = (template.match(/\$\{/g) || []).length;
                const closeCount = (template.match(/\}/g) || []).length;
                if (openCount !== closeCount) {
                    console.log(`Line ${index + 1}: ${template}`);
                    console.log(`  Open ${openCount}, Close ${closeCount}`);
                }
            });
        }
    }
});
