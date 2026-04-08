import { useState, useEffect, useCallback } from 'react';

interface UseBossKeyOptions {
  onBossKeyActivated: () => void;
}

// 动态标题列表
const titles = ['Analysis.xlsx', 'Weekly_Sync.pptx', 'Main.ts'];

export function useBossKey({ onBossKeyActivated }: UseBossKeyOptions) {
  const [isBossMode, setIsBossMode] = useState(false);
  const [escPressCount, setEscPressCount] = useState(0);
  const [lastEscPressTime, setLastEscPressTime] = useState(0);

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  // 处理键盘事件
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 检测 Esc 键双击
    if (event.key === 'Escape') {
      const now = Date.now();
      if (now - lastEscPressTime < 1000) {
        // 1秒内按下两次 Esc 键
        setEscPressCount(0);
        setLastEscPressTime(0);
        setIsBossMode(true);
        onBossKeyActivated();
      } else {
        setEscPressCount(1);
        setLastEscPressTime(now);
      }
    } else if (event.key === 'Escape' && event.ctrlKey && event.shiftKey) {
      // 检测 Ctrl+Shift+Esc 组合键
      setIsBossMode(true);
      onBossKeyActivated();
    } else {
      // 重置 Esc 键计数
      setEscPressCount(0);
      setLastEscPressTime(0);
    }
  }, [lastEscPressTime, onBossKeyActivated]);

  // 动态修改 document.title
  useEffect(() => {
    const updateTitle = () => {
      const randomIndex = Math.floor(Math.random() * titles.length);
      document.title = titles[randomIndex];
    };

    // 初始设置标题
    updateTitle();

    // 每30秒更新一次标题
    const titleInterval = setInterval(updateTitle, 30000);

    return () => clearInterval(titleInterval);
  }, []);

  // 监听键盘事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 退出老板模式
  const exitBossMode = useCallback(() => {
    setIsBossMode(false);
  }, []);

  return {
    isBossMode,
    exitBossMode
  };
}

export default useBossKey;
