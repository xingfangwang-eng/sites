const fs = require('fs');

// 读取文件
const content = fs.readFileSync('script.js', 'utf8');

// 修复乱码字符
const fixedContent = content
    // 移除乱码字符
    .replace(/\ufffd/g, '')
    // 修复剩余的乱码模式
    .replace(/Request Error\?\{/g, 'Request Error: {')
    .replace(/retries remaining\?\.\./g, 'retries remaining...')
    .replace(/Network error\?\{/g, 'Network error: {')
    .replace(/retried \?\${/g, 'retried ${')
    .replace(/}\s*\?/g, '} ')
    .replace(/requests\?\.\./g, 'requests...')
    .replace(/'Pending\?/g, "'Pending'")
    .replace(/'Running\?/g, "'Running'")
    .replace(/'Cancelled\?/g, "'Cancelled'")
    // 修复任何剩余的乱码
    .replace(/\?/g, '')
    // 确保代码中的模板字符串正确
    .replace(/\$\{retryCount/g, '${retryCount}');

// 写入文件
fs.writeFileSync('script.js', fixedContent, 'utf8');

console.log('Fixed garbled characters in script.js');
