const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 逐行检查语法
const lines = content.split('\n');
let accumulatedCode = '';

for (let i = 0; i < lines.length; i++) {
    accumulatedCode += lines[i] + '\n';
    try {
        new Function(accumulatedCode);
    } catch (e) {
        console.log(`Syntax error detected at line ${i + 1}`);
        console.log(`Line content: ${lines[i].substring(0, 100)}...`);
        console.log(`Error message: ${e.message}`);
        break;
    }
}

console.log('Completed line-by-line check');
