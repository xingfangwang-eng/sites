// Web Worker 用于保持网页活跃

// 定期向主线程发送消息
function keepAlive() {
  self.postMessage({ type: 'keep-alive' });
  setTimeout(keepAlive, 60000); // 每分钟发送一次
}

// 启动 keep-alive 循环
keepAlive();

// 监听主线程消息
self.addEventListener('message', (event) => {
  if (event.data === 'stop') {
    self.close();
  }
});
