const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GA_TRACKING_ID = 'G-WC4677QJMF';
const COMMIT_MESSAGE = 'Add Google Analytics tracking code';

function findProjectsWithGit(rootDir) {
  const projects = [];
  const items = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const fullPath = path.join(rootDir, item.name);
      const gitDir = path.join(fullPath, '.git');
      
      if (fs.existsSync(gitDir)) {
        projects.push({
          name: item.name,
          path: fullPath
        });
      }
    }
  }

  return projects;
}

function hasGAChanges(projectPath) {
  try {
    const status = execSync('git status --porcelain', {
      cwd: projectPath,
      encoding: 'utf-8'
    });

    if (!status.trim()) {
      return false;
    }

    const changedFiles = status.split('\n').filter(line => line.trim());
    
    for (const file of changedFiles) {
      const filePath = file.split(' ').pop();
      const fullPath = path.join(projectPath, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes(GA_TRACKING_ID)) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error(`检查 ${projectPath} 时出错: ${error.message}`);
    return false;
  }
}

function pushToGitHub(project) {
  try {
    console.log(`\n========================================`);
    console.log(`处理项目: ${project.name}`);
    console.log(`路径: ${project.path}`);
    console.log(`========================================`);

    const status = execSync('git status --porcelain', {
      cwd: project.path,
      encoding: 'utf-8'
    });

    if (!status.trim()) {
      console.log(`✓ 没有需要提交的更改`);
      return { success: true, message: 'No changes' };
    }

    console.log(`发现更改的文件:`);
    console.log(status);

    console.log(`\n检查远程仓库配置...`);
    let remoteUrl = '';
    try {
      remoteUrl = execSync('git remote get-url origin', {
        cwd: project.path,
        encoding: 'utf-8'
      }).trim();
      console.log(`远程仓库: ${remoteUrl}`);
    } catch (error) {
      console.log(`✗ 没有配置远程仓库`);
      return { success: false, message: 'No remote repository configured' };
    }

    console.log(`\n执行 git add .`);
    execSync('git add .', {
      cwd: project.path,
      encoding: 'utf-8'
    });

    console.log(`执行 git commit -m "${COMMIT_MESSAGE}"`);
    execSync(`git commit -m "${COMMIT_MESSAGE}"`, {
      cwd: project.path,
      encoding: 'utf-8'
    });

    console.log(`执行 git push`);
    try {
      const pushResult = execSync('git push', {
        cwd: project.path,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      console.log(`✓ 成功推送到 GitHub`);
      return { success: true, message: 'Pushed successfully' };
    } catch (pushError) {
      console.log(`尝试使用 git push origin HEAD:main`);
      try {
        execSync('git push origin HEAD:main', {
          cwd: project.path,
          encoding: 'utf-8',
          stdio: 'pipe'
        });
        console.log(`✓ 成功推送到 GitHub (使用 HEAD:main)`);
        return { success: true, message: 'Pushed successfully (HEAD:main)' };
      } catch (error2) {
        console.log(`尝试使用 git push --set-upstream origin main`);
        try {
          execSync('git push --set-upstream origin main', {
            cwd: project.path,
            encoding: 'utf-8',
            stdio: 'pipe'
          });
          console.log(`✓ 成功推送到 GitHub (设置上游分支)`);
          return { success: true, message: 'Pushed successfully (set upstream)' };
        } catch (error3) {
          throw error3;
        }
      }
    }
  } catch (error) {
    console.error(`✗ 推送失败: ${error.message}`);
    return { success: false, message: error.message };
  }
}

function main() {
  const rootDir = process.cwd();
  console.log(`扫描目录: ${rootDir}\n`);

  const projects = findProjectsWithGit(rootDir);
  console.log(`找到 ${projects.length} 个 Git 项目:\n`);

  if (projects.length === 0) {
    console.log('没有找到任何 Git 项目');
    return;
  }

  const results = {
    total: projects.length,
    success: 0,
    failed: 0,
    skipped: 0,
    details: []
  };

  for (const project of projects) {
    const hasChanges = hasGAChanges(project.path);
    
    if (hasChanges) {
      const result = pushToGitHub(project);
      results.details.push({
        name: project.name,
        ...result
      });
      
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
      }
    } else {
      console.log(`\n[跳过] ${project.name} - 没有 GA 相关的更改`);
      results.skipped++;
      results.details.push({
        name: project.name,
        success: true,
        message: 'No GA changes'
      });
    }
  }

  console.log(`\n========================================`);
  console.log(`执行完成统计`);
  console.log(`========================================`);
  console.log(`总项目数: ${results.total}`);
  console.log(`成功推送: ${results.success}`);
  console.log(`推送失败: ${results.failed}`);
  console.log(`跳过项目: ${results.skipped}`);
  console.log(`\n详细结果:`);
  
  for (const detail of results.details) {
    const status = detail.success ? '✓' : '✗';
    console.log(`${status} ${detail.name}: ${detail.message}`);
  }
}

main();
