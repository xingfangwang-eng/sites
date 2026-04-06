const fs = require('fs');
const path = require('path');

const GA_TRACKING_ID = 'G-WC4677QJMF';

function generateGACode(projectName) {
  return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // 动态注入项目名
  gtag('config', '${GA_TRACKING_ID}', {
    'project_name': '${projectName}'
  });
</script>`;
}

function findTargetFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      const dirName = item.name.toLowerCase();
      if (dirName === 'node_modules' || dirName === '.git' || dirName === 'dist' || dirName === 'build' || dirName === '.next') {
        continue;
      }
      findTargetFiles(fullPath, files);
    } else if (item.name === 'index.html' || item.name === 'layout.tsx' || item.name === 'layout.js') {
      const parentDir = path.basename(path.dirname(fullPath));
      if ((item.name === 'layout.tsx' || item.name === 'layout.js') && parentDir === 'app') {
        files.push({ path: fullPath, type: 'nextjs' });
      } else if (item.name === 'index.html') {
        files.push({ path: fullPath, type: 'html' });
      }
    }
  }

  return files;
}

function getProjectName(filePath) {
  let currentDir = path.dirname(filePath);
  
  while (currentDir !== path.dirname(currentDir)) {
    const dirName = path.basename(currentDir);
    if (dirName !== 'public' && dirName !== 'app') {
      return dirName;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return path.basename(filePath);
}

function injectGAHtml(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes(GA_TRACKING_ID)) {
      console.log(`[跳过] ${filePath} - 已包含 GA 代码`);
      return false;
    }

    const projectName = getProjectName(filePath);
    const gaCode = generateGACode(projectName);

    const headMatch = content.match(/<head[^>]*>/i);
    if (!headMatch) {
      console.log(`[跳过] ${filePath} - 未找到 <head> 标签`);
      return false;
    }

    const headTag = headMatch[0];
    const headIndex = content.indexOf(headTag) + headTag.length;

    const newContent = content.slice(0, headIndex) + '\n' + gaCode + content.slice(headIndex);

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[成功] ${filePath} - 项目: ${projectName}`);
    return true;
  } catch (error) {
    console.error(`[错误] ${filePath} - ${error.message}`);
    return false;
  }
}

function injectGANextjs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes(GA_TRACKING_ID)) {
      console.log(`[跳过] ${filePath} - 已包含 GA 代码`);
      return false;
    }

    const projectName = getProjectName(filePath);
    const gaCode = generateGACode(projectName);

    const returnMatch = content.match(/return\s*\(/);
    if (!returnMatch) {
      console.log(`[跳过] ${filePath} - 未找到 return ( 语句`);
      return false;
    }

    const htmlMatch = content.slice(returnMatch.index).match(/<html[^>]*>/i);
    if (!htmlMatch) {
      console.log(`[跳过] ${filePath} - 未找到 <html> 标签`);
      return false;
    }

    const htmlTag = htmlMatch[0];
    const htmlIndex = content.indexOf(htmlTag, returnMatch.index) + htmlTag.length;

    const newContent = content.slice(0, htmlIndex) + '\n' + gaCode + content.slice(htmlIndex);

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[成功] ${filePath} - 项目: ${projectName}`);
    return true;
  } catch (error) {
    console.error(`[错误] ${filePath} - ${error.message}`);
    return false;
  }
}

function main() {
  const rootDir = process.cwd();
  console.log(`开始扫描目录: ${rootDir}\n`);

  const targetFiles = findTargetFiles(rootDir);

  if (targetFiles.length === 0) {
    console.log('未找到任何 index.html 或 Next.js layout 文件');
    return;
  }

  console.log(`找到 ${targetFiles.length} 个目标文件:\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const file of targetFiles) {
    let injected;
    if (file.type === 'html') {
      injected = injectGAHtml(file.path);
    } else {
      injected = injectGANextjs(file.path);
    }
    if (injected) {
      successCount++;
    } else {
      skipCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`处理完成: 成功 ${successCount} 个, 跳过 ${skipCount} 个`);
  console.log(`========================================`);
}

main();
