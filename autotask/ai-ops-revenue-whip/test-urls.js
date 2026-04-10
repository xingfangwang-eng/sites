const https = require('https');
const http = require('http');

// 测试 URL 列表
const urls = [
  'http://localhost:3002',
  'http://localhost:3002/api/auth/session',
  'http://localhost:3002/api/auth/providers'
];

// 测试函数
function testUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const start = Date.now();
    
    protocol.get(url, (res) => {
      const end = Date.now();
      const time = end - start;
      console.log(`✓ ${url} - Status: ${res.statusCode} - Time: ${time}ms`);
      resolve({ url, status: res.statusCode, time });
    }).on('error', (err) => {
      const end = Date.now();
      const time = end - start;
      console.log(`✗ ${url} - Error: ${err.message} - Time: ${time}ms`);
      resolve({ url, status: 0, error: err.message, time });
    });
  });
}

// 运行所有测试
async function runTests() {
  console.log('Testing URLs...\n');
  
  const results = await Promise.all(urls.map(testUrl));
  
  console.log('\nTest Results Summary:');
  console.log('====================');
  
  const success = results.filter(r => r.status >= 200 && r.status < 300);
  const failed = results.filter(r => r.status === 0 || r.status >= 400);
  
  console.log(`Success: ${success.length}/${results.length}`);
  console.log(`Failed: ${failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed URLs:');
    failed.forEach(r => {
      console.log(`- ${r.url}: ${r.error || `Status ${r.status}`}`);
    });
  }
}

runTests();
