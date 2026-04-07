// Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "YOUR_DATABASE_URL"
};

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
        // 加载 Auth 脚本
        const authScript = document.createElement('script');
        authScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
        authScript.onload = () => {
          // 初始化 Firebase
          firebase.initializeApp(firebaseConfig);
          resolve();
        };
        authScript.onerror = reject;
        document.head.appendChild(authScript);
      };
      dbScript.onerror = reject;
      document.head.appendChild(dbScript);
    };
    coreScript.onerror = reject;
    document.head.appendChild(coreScript);
  });
}

// 初始化 Firebase
let firebaseApp = null;
let database = null;
let auth = null;

async function initFirebase() {
  if (!firebaseApp) {
    await loadFirebaseScripts();
    firebaseApp = firebase.app();
    database = firebase.database();
    auth = firebase.auth();
  }
  return { firebaseApp, database, auth };
}

// 同步记忆到 Firebase
async function syncMemoryToFirebase(uid, content, sourceUrl) {
  const { database } = await initFirebase();
  const memoriesRef = database.ref(`users/${uid}/memories`);
  const newMemoryRef = memoriesRef.push();
  await newMemoryRef.set({
    content,
    sourceUrl,
    timestamp: Date.now(),
    tags: []
  });
  return newMemoryRef.key;
}

// 导出函数
export { initFirebase, syncMemoryToFirebase };
