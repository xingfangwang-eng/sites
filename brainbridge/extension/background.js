// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === "sync-memory") {
    // 获取当前活动标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // 向 Content Script 发送消息
        chrome.tabs.sendMessage(tabs[0].id, { action: "sync-memory" });
      }
    });
  }
});
