// 监听来自 Background Script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sync-memory") {
    // 获取当前选中的文本
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
      // 清洗 Markdown 文本
      const cleanedText = cleanMarkdown(selectedText);
      
      // 显示 Toast 提示
      showToast("Memory Synced to Bridge");
      
      // 同步到 Firebase
      syncToFirebase(cleanedText);
    }
  }
});

// 清洗 Markdown 文本的函数
function cleanMarkdown(text) {
  // 去掉代码块 ```...```
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // 去掉粗体和斜体 **...** 和 *...*
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  
  // 去掉标题 #...
  text = text.replace(/^\s*#+\s*(.*)$/gm, '$1');
  
  // 去掉列表标记
  text = text.replace(/^\s*[*+-]\s*(.*)$/gm, '$1');
  
  // 去掉链接 [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
  
  // 去掉引用 > ...
  text = text.replace(/^\s*>\s*(.*)$/gm, '$1');
  
  // 去掉水平线
  text = text.replace(/^\s*-{3,}\s*$/gm, '');
  
  // 去掉多余的空白行
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}

// 显示 Toast 提示的函数
function showToast(message) {
  // 创建 Toast 元素
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#6366f1';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  toast.style.animation = 'slideIn 0.3s ease-out';
  toast.textContent = message;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // 添加到文档
  document.body.appendChild(toast);
  
  // 3 秒后移除
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-in reverse';
    setTimeout(() => {
      document.body.removeChild(toast);
      document.head.removeChild(style);
    }, 300);
  }, 3000);
}

// 同步到 Firebase 的函数
async function syncToFirebase(text) {
  // 从 storage 中获取用户 UID
  chrome.storage.local.get(['uid'], async (result) => {
    const uid = result.uid;
    
    if (uid) {
      try {
        // 加载 Firebase 脚本
        await loadFirebaseScripts();
        
        // 初始化 Firebase
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp({
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
            databaseURL: "YOUR_DATABASE_URL"
          });
        }
        
        // 检查用户是否为 Pro 以及记忆数量
        const database = window.firebase.database();
        const userRef = database.ref(`users/${uid}`);
        const memoriesRef = database.ref(`users/${uid}/memories`);
        
        const [userSnapshot, memoriesSnapshot] = await Promise.all([
          userRef.once('value'),
          memoriesRef.once('value')
        ]);
        
        const isPro = userSnapshot.val()?.isPro || false;
        const memoryCount = memoriesSnapshot.numChildren();
        
        // 权限检查：非 Pro 用户最多 5 条记忆
        if (!isPro && memoryCount >= 5) {
          showToast('Memory full, upgrade to Bridge the gap');
          return;
        }
        
        // 同步到 Firebase
        const newMemoryRef = memoriesRef.push();
        await newMemoryRef.set({
          content: text,
          sourceUrl: window.location.href,
          timestamp: Date.now(),
          tags: []
        });
        
        console.log('Memory synced successfully:', newMemoryRef.key);
      } catch (error) {
        console.error('Error syncing to Firebase:', error);
      }
    } else {
      console.log('User not authenticated');
    }
  });
}

// 加载 Firebase 脚本
function loadFirebaseScripts() {
  return new Promise((resolve, reject) => {
    // 检查 Firebase 是否已加载
    if (window.firebase) {
      resolve();
      return;
    }

    // 加载 Firebase 核心脚本
    const coreScript = document.createElement('script');
    coreScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
    coreScript.onload = () => {
      // 加载 Realtime Database 脚本
      const dbScript = document.createElement('script');
      dbScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
      dbScript.onload = () => {
        resolve();
      };
      dbScript.onerror = reject;
      document.head.appendChild(dbScript);
    };
    coreScript.onerror = reject;
    document.head.appendChild(coreScript);
  });
}

// 定义 BridgeBar Web Component
class BridgeBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isExpanded = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.loadMemories();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          z-index: 9998;
        }

        .bridge-bar {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .toggle-button {
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 8px 0 0 8px;
          padding: 12px 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .toggle-button:hover {
          background-color: #4f46e5;
        }

        .memories-panel {
          background-color: rgba(10, 10, 10, 0.8);
          color: white;
          border-radius: 8px 0 0 8px;
          padding: 16px;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
        }

        .memories-panel.collapsed {
          transform: translateX(100%);
          opacity: 0;
          pointer-events: none;
        }

        .panel-header {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          text-align: center;
        }

        .memory-item {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
          transition: background-color 0.2s ease;
        }

        .memory-item:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .memory-content {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .memory-meta {
          font-size: 12px;
          color: #a1a1aa;
          margin-bottom: 8px;
        }

        .copy-button {
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .copy-button:hover {
          background-color: #4f46e5;
        }

        .no-memories {
          text-align: center;
          color: #a1a1aa;
          font-size: 14px;
          padding: 20px 0;
        }
      </style>
      
      <div class="bridge-bar">
        <div class="memories-panel ${this.isExpanded ? '' : 'collapsed'}">
          <div class="panel-header">Recent Memories</div>
          <div class="memories-list" id="memoriesList"></div>
        </div>
        <button class="toggle-button" id="toggleButton">Bridge</button>
      </div>
    `;
  }

  setupEventListeners() {
    const toggleButton = this.shadowRoot.getElementById('toggleButton');
    toggleButton.addEventListener('click', () => {
      this.isExpanded = !this.isExpanded;
      this.render();
      this.setupEventListeners();
      if (this.isExpanded) {
        this.loadMemories();
      }
    });
  }

  async loadMemories() {
    const memoriesList = this.shadowRoot.getElementById('memoriesList');
    memoriesList.innerHTML = '<div class="no-memories">Loading memories...</div>';

    // 从 storage 中获取用户 UID
    chrome.storage.local.get(['uid'], async (result) => {
      const uid = result.uid;
      
      if (uid) {
        try {
          // 加载 Firebase 脚本
          await loadFirebaseScripts();
          
          // 初始化 Firebase
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp({
              apiKey: "YOUR_API_KEY",
              authDomain: "YOUR_AUTH_DOMAIN",
              projectId: "YOUR_PROJECT_ID",
              storageBucket: "YOUR_STORAGE_BUCKET",
              messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
              appId: "YOUR_APP_ID",
              databaseURL: "YOUR_DATABASE_URL"
            });
          }
          
          // 从 Firebase 拉取最近的 3 条记忆
          const database = window.firebase.database();
          const memoriesRef = database.ref(`users/${uid}/memories`);
          const snapshot = await memoriesRef.orderByChild('timestamp').limitToLast(3).once('value');
          
          if (snapshot.exists()) {
            const memories = [];
            snapshot.forEach((childSnapshot) => {
              memories.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            
            // 按时间倒序排列
            memories.reverse();
            
            // 渲染记忆列表
            memoriesList.innerHTML = '';
            memories.forEach(memory => {
              const memoryItem = document.createElement('div');
              memoryItem.className = 'memory-item';
              memoryItem.innerHTML = `
                <div class="memory-content">${memory.content.substring(0, 100)}${memory.content.length > 100 ? '...' : ''}</div>
                <div class="memory-meta">${new Date(memory.timestamp).toLocaleString()}</div>
                <button class="copy-button" data-content="${memory.content}">Quick Copy</button>
              `;
              memoriesList.appendChild(memoryItem);
            });
            
            // 添加复制按钮事件监听器
            const copyButtons = this.shadowRoot.querySelectorAll('.copy-button');
            copyButtons.forEach(button => {
              button.addEventListener('click', async () => {
                const content = button.getAttribute('data-content');
                await navigator.clipboard.writeText(content);
                showToast('Ready for Cursor');
              });
            });
          } else {
            memoriesList.innerHTML = '<div class="no-memories">No memories yet</div>';
          }
        } catch (error) {
          console.error('Error loading memories:', error);
          memoriesList.innerHTML = '<div class="no-memories">Error loading memories</div>';
        }
      } else {
        memoriesList.innerHTML = '<div class="no-memories">User not authenticated</div>';
      }
    });
  }
}

// 注册 BridgeBar Web Component
customElements.define('bridge-bar', BridgeBar);

// 注入 BridgeBar 到页面
function injectBridgeBar() {
  // 检查是否已经注入
  if (!document.querySelector('bridge-bar')) {
    const bridgeBar = document.createElement('bridge-bar');
    document.body.appendChild(bridgeBar);
  }
}

// 页面加载完成后注入 BridgeBar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectBridgeBar);
} else {
  injectBridgeBar();
}
