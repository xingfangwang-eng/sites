const fs = require('fs');
const path = require('path');

try {
  const appDir = path.join(__dirname, '.next', 'server', 'app');
  console.log('Checking directory:', appDir);
  console.log('Directory exists:', fs.existsSync(appDir));
  
  if (fs.existsSync(appDir)) {
    const files = fs.readdirSync(appDir);
    console.log('Total files in directory:', files.length);
    
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    console.log('HTML files found:', htmlFiles.length);
    console.log('HTML files:', htmlFiles);
    
    let staticPageCount = 0;
    htmlFiles.forEach(file => {
      if (!file.startsWith('_') && 
          file !== 'index.html' && 
          file !== 'sitemap.html' && 
          file !== 'solutions.html') {
        staticPageCount++;
      }
    });
    
    console.log('Static pages count:', staticPageCount);
  } else {
    console.error('Directory does not exist:', appDir);
  }
} catch (error) {
  console.error('Error:', error);
}