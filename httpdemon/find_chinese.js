const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 分割成行
const lines = content.split('\n');

// 查找包含中文的行
lines.forEach((line, index) => {
    if (/[\u4e00-\u9fa5]/.test(line)) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
