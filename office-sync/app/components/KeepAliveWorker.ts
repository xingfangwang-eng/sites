export class KeepAliveWorker {
  private worker: Worker | null = null;

  start() {
    if (this.worker) return;

    // 创建 Web Worker
    this.worker = new Worker('/workers/keep-alive.worker.js');

    // 监听 Web Worker 消息
    this.worker.addEventListener('message', (event) => {
      if (event.data.type === 'keep-alive') {
        // 模拟用户活动
        this.simulateUserActivity();
      }
    });

    console.log('Keep-alive worker started');
  }

  stop() {
    if (!this.worker) return;

    this.worker.postMessage('stop');
    this.worker = null;
    console.log('Keep-alive worker stopped');
  }

  private simulateUserActivity() {
    // 模拟鼠标移动
    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: Math.random() * window.innerWidth,
      clientY: Math.random() * window.innerHeight
    });
    document.dispatchEvent(event);

    // 模拟键盘按键
    const keyEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Shift'
    });
    document.dispatchEvent(keyEvent);

    // 模拟键盘释放
    const keyUpEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: 'Shift'
    });
    document.dispatchEvent(keyUpEvent);
  }
}

export default new KeepAliveWorker();
