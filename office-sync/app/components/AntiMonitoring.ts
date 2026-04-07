export class AntiMonitoring {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.simulateActivity();
    }, 3000); // 每3秒模拟一次活动
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private simulateActivity() {
    // 随机选择一个单元格
    const row = Math.floor(Math.random() * 20) + 1; // 1-20行
    const col = Math.floor(Math.random() * 10); // 0-9列，对应A-J
    const colLetter = String.fromCharCode(65 + col);
    const cellSelector = `td:nth-child(${col + 2})`; // +2因为第一列是行号
    
    // 找到对应的单元格
    const table = document.querySelector('table');
    if (table) {
      const rowElement = table.querySelector(`tbody tr:nth-child(${row})`);
      if (rowElement) {
        const cellElement = rowElement.querySelector(cellSelector);
        if (cellElement) {
          // 模拟点击单元格
          cellElement.click();
          
          // 模拟输入数据
          this.simulateInput(cellElement);
        }
      }
    }
  }

  private simulateInput(cellElement: Element) {
    // 只在数据单元格模拟输入，跳过表头
    if (cellElement.textContent?.trim() && !cellElement.textContent.includes('Date') && 
        !cellElement.textContent.includes('Description') && !cellElement.textContent.includes('Category') && 
        !cellElement.textContent.includes('Amount')) {
      // 随机修改单元格内容
      const randomValue = `$${(Math.random() * 1000).toFixed(2)}`;
      cellElement.textContent = randomValue;
    }
  }
}

export default new AntiMonitoring();
