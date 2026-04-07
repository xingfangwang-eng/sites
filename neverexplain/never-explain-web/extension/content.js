console.log('NeverExplain Extension Loaded');

// 监听所有输入元素
function setupInputListeners() {
  // 监听 input 和 textarea
  const inputElements = document.querySelectorAll('input, textarea');
  inputElements.forEach(element => {
    element.addEventListener('keydown', handleKeyDown);
  });

  // 监听 contenteditable 元素（如 ChatGPT）
  const contentEditableElements = document.querySelectorAll('[contenteditable="true"]');
  contentEditableElements.forEach(element => {
    element.addEventListener('keydown', handleKeyDown);
  });

  // 监听动态添加的元素
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
            node.addEventListener('keydown', handleKeyDown);
          } else if (node.getAttribute('contenteditable') === 'true') {
            node.addEventListener('keydown', handleKeyDown);
          }
          // 检查子元素
          const childInputs = node.querySelectorAll('input, textarea, [contenteditable="true"]');
          childInputs.forEach(child => {
            child.addEventListener('keydown', handleKeyDown);
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 处理按键事件
function handleKeyDown(event) {
  // 只处理空格和 Enter 键
  if (event.key !== ' ' && event.key !== 'Enter') {
    return;
  }

  const target = event.target;
  let text = '';
  let selectionStart = 0;
  let selectionEnd = 0;

  // 获取输入框内容和光标位置
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    text = target.value;
    selectionStart = target.selectionStart;
    selectionEnd = target.selectionEnd;
  } else if (target.getAttribute('contenteditable') === 'true') {
    // 处理 contenteditable 元素
    const selection = window.getSelection();
    if (selection) {
      selectionStart = selection.anchorOffset;
      selectionEnd = selection.focusOffset;
      text = target.textContent || '';
    }
  }

  // 提取最后一个 /recall- 开头的字符串
  const textBeforeCursor = text.substring(0, selectionStart);
  const recallMatch = textBeforeCursor.match(/\/recall-([a-zA-Z0-9-]+)\s*$/);

  if (recallMatch) {
    event.preventDefault();
    const hook = recallMatch[1];
    const recallText = recallMatch[0];
    
    // 显示加载提示
    const loadingElement = createLoadingElement(target);
    
    // 从 storage 获取 Base URL
    chrome.storage.local.get('baseUrl', (result) => {
      const baseUrl = result.baseUrl || 'http://localhost:3000';
      
      // 请求 API
      fetch(`${baseUrl}/api/context?hook=recall-${hook}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('API request failed');
          }
          return response.text();
        })
        .then(content => {
          // 替换 /recall-xxx 为 content
          replaceRecallText(target, recallText, content);
        })
        .catch(error => {
          console.error('Error fetching context:', error);
          // 显示红色错误提示
          showErrorNotification(target, 'Hook not found');
          // 替换为错误信息
          replaceRecallText(target, recallText, `Error: Hook not found for recall-${hook}`);
        })
        .finally(() => {
          // 移除加载提示
          if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
          }
        });
    });
  }
}

// 创建加载提示元素
function createLoadingElement(target) {
  const loadingElement = document.createElement('div');
  loadingElement.style.position = 'absolute';
  loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  loadingElement.style.color = 'white';
  loadingElement.style.padding = '8px 12px';
  loadingElement.style.borderRadius = '4px';
  loadingElement.style.fontSize = '12px';
  loadingElement.style.zIndex = '10000';
  loadingElement.textContent = 'Loading...';

  // 定位到输入框上方
  const rect = target.getBoundingClientRect();
  loadingElement.style.left = `${rect.left}px`;
  loadingElement.style.top = `${rect.top - 30}px`;

  document.body.appendChild(loadingElement);
  return loadingElement;
}

// 显示错误提示
function showErrorNotification(target, message) {
  const errorElement = document.createElement('div');
  errorElement.style.position = 'absolute';
  errorElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
  errorElement.style.color = 'white';
  errorElement.style.padding = '8px 12px';
  errorElement.style.borderRadius = '4px';
  errorElement.style.fontSize = '12px';
  errorElement.style.zIndex = '10000';
  errorElement.textContent = message;

  // 定位到输入框上方
  const rect = target.getBoundingClientRect();
  errorElement.style.left = `${rect.left}px`;
  errorElement.style.top = `${rect.top - 30}px`;

  document.body.appendChild(errorElement);

  // 3秒后自动消失
  setTimeout(() => {
    if (errorElement && errorElement.parentNode) {
      errorElement.parentNode.removeChild(errorElement);
    }
  }, 3000);
}

// 插入文本到光标位置
function insertTextAtCursor(text) {
  const el = document.activeElement;
  el.focus();
  document.execCommand('insertText', false, text);
}

// 替换 /recall-xxx 为 content
function replaceRecallText(target, recallText, content) {
  // 处理所有类型的输入元素，使用统一的 insertTextAtCursor 方法
  target.focus();
  
  // 向后选择 recallText
  const selection = window.getSelection();
  if (selection) {
    const range = selection.getRangeAt(0);
    const start = range.startOffset - recallText.length;
    if (start >= 0) {
      range.setStart(range.startContainer, start);
      range.deleteContents();
      
      // 处理换行符，确保在 contenteditable 中正确显示
      const contentWithBreaks = content.replace(/\n/g, '\n');
      
      // 插入内容
      insertTextAtCursor(contentWithBreaks);
    }
  }
}

// 初始化
setupInputListeners();

