const fs = require('fs');
const path = require('path');

// Google Analytics tracking ID
const GA_TRACKING_ID = 'G-WC4677QJMF';

// Base directory to start scanning
const BASE_DIR = process.cwd();

/**
 * Recursively scan directories for index.html and layout.tsx files
 * @param {string} dir - Current directory to scan
 */
function scanDirectories(dir) {
  // Skip node_modules directories
  if (dir.includes('node_modules')) {
    return;
  }
  
  // Skip .next directories
  if (dir.includes('.next')) {
    return;
  }
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectories(fullPath);
        } else if (file === 'index.html' || file === 'layout.tsx') {
          // Process the file
          processFile(fullPath);
        }
      } catch (error) {
        // Skip files that can't be accessed
        console.log(`Skipping ${fullPath} - ${error.message}`);
      }
    });
  } catch (error) {
    // Skip directories that can't be accessed
    console.log(`Skipping directory ${dir} - ${error.message}`);
  }
}

/**
 * Process a file to inject Google Analytics code
 * @param {string} filePath - Path to the file
 */
function processFile(filePath) {
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if GA code already exists
  if (content.includes(GA_TRACKING_ID)) {
    console.log(`Skipping ${filePath} - GA code already present`);
    return;
  }
  
  // Get project name (first-level subdirectory)
  const relativePath = path.relative(BASE_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  const projectName = pathParts[0] || 'default';
  
  // Inject GA code based on file type
  if (path.basename(filePath) === 'index.html') {
    // Inject in index.html
    const gaCode = `
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      'custom_map': {
        'dimension1': 'project_name'
      },
      'project_name': '${projectName}'
    });
  </script>
  <!-- End Google Analytics -->
`;
    
    // Insert before </head>
    content = content.replace('</head>', gaCode + '</head>');
  } else if (path.basename(filePath) === 'layout.tsx') {
    // Inject in layout.tsx
    const gaCode = `
    {/* Google Analytics */}
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}"></script>
    <script dangerouslySetInnerHTML={{
      __html: \`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          'custom_map': {
            'dimension1': 'project_name'
          },
          'project_name': '${projectName}'
        });
      \`
    }} />
    {/* End Google Analytics */}
`;
    
    // Insert after <head>
    content = content.replace('<head>', '<head>' + gaCode);
  }
  
  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Injected GA code into ${filePath}`);
}

// Start scanning from base directory
console.log('Starting GA code injection...');
scanDirectories(BASE_DIR);
console.log('GA code injection completed!');
