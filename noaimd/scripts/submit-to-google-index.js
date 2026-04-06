const { JWT } = require('google-auth-library');
const { google } = require('googleapis');

const fs = require('fs');
const path = require('path');

// 读取 sitemap.ts 文件，提取所有 URL
function extractUrlsFromSitemap() {
  // 由于 sitemap.ts 使用 TypeScript 和 ES 模块，我们需要手动解析
  const sitemapPath = path.join(__dirname, '../app/sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // 提取 baseUrl
  const baseUrlMatch = sitemapContent.match(/const baseUrl = '(.*?)'/);
  if (!baseUrlMatch) {
    throw new Error('Could not find baseUrl in sitemap.ts');
  }
  const baseUrl = baseUrlMatch[1];
  
  // 读取 keywordsData
  const keywordsDataPath = path.join(__dirname, '../@data/keywords.json');
  const keywordsData = JSON.parse(fs.readFileSync(keywordsDataPath, 'utf8'));
  
  // 生成所有 URL
  const urls = [baseUrl];
  keywordsData.forEach(keyword => {
    urls.push(`${baseUrl}/${keyword.slug}`);
  });
  
  return urls;
}

// 提交 URL 到 Google Indexing API
async function submitUrlsToGoogleIndex(urls, credentialsPath) {
  // 读取凭据文件
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  
  // 创建 JWT 客户端
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });
  
  // 授权客户端
  await client.authorize();
  
  // 提交每个 URL
  let successCount = 0;
  
  for (const url of urls) {
    try {
      // 使用 fetch 发送请求
      const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${client.credentials.access_token}`
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED'
        })
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
      
      console.log(`Successfully submitted: ${url}`);
      successCount++;
    } catch (error) {
      console.error(`Error submitting ${url}:`, error.message);
    }
    
    // 避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
  
  return successCount;
}

// 主函数
async function main() {
  try {
    // 提取 URL
    const urls = extractUrlsFromSitemap();
    console.log(`Found ${urls.length} URLs to submit`);
    
    // 检查凭据文件是否存在
    const credentialsPath = path.join(__dirname, '../google-credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      console.error('Please create a google-credentials.json file with your Google Cloud service account credentials');
      console.error('You can download this file from the Google Cloud Console');
      process.exit(1);
    }
    
    // 提交 URL
    const successCount = await submitUrlsToGoogleIndex(urls, credentialsPath);
    
    // 打印结果
    console.log(`\nSubmission complete!`);
    console.log(`Successfully submitted ${successCount} out of ${urls.length} URLs`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// 运行主函数
main();
