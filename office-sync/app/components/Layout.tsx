'use client';
import React, { useState, useEffect } from 'react';
import GameContainer from './GameContainer';
import antiMonitoring from './AntiMonitoring';
import keepAliveWorker from './KeepAliveWorker';
import useBossKey from './useBossKey';
import FinancialReport from './FinancialReport';
import EmailManager from './EmailManager';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [showGameContainer, setShowGameContainer] = useState(false);

  // 使用老板键 Hook
  const { isBossMode, exitBossMode } = useBossKey({
    onBossKeyActivated: () => {
      // 关闭游戏容器
      setShowGameContainer(false);
    }
  });

  // 当游戏容器状态变化时，启动或停止反监控
  useEffect(() => {
    if (showGameContainer) {
      // 启动反监控
      antiMonitoring.start();
      // 启动 Web Worker 保持活跃
      keepAliveWorker.start();
    } else {
      // 停止反监控
      antiMonitoring.stop();
      // 停止 Web Worker
      keepAliveWorker.stop();
    }

    // 清理函数
    return () => {
      antiMonitoring.stop();
      keepAliveWorker.stop();
    };
  }, [showGameContainer]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    // 检查是否点击了右下角单元格
    const target = e.target as HTMLElement;
    if (target.classList.contains('cell-corner')) {
      setShowGameContainer(!showGameContainer);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 顶部导航栏 - 模拟 Microsoft 365 丝带菜单 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-2 bg-blue-600 text-white">
          <div className="flex items-center space-x-2 mr-6">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-lg font-semibold">Financial Tracker</h1>
        </div>
        <div className="flex border-b border-gray-200">
          {['File', 'Home', 'Insert', 'Data', 'Review', 'View', '邮件'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
              Save
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
              Undo
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
              Redo
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Arial</span>
              <span className="text-sm">11</span>
              <button className="p-1 hover:bg-gray-200 rounded">B</button>
              <button className="p-1 hover:bg-gray-200 rounded">I</button>
              <button className="p-1 hover:bg-gray-200 rounded">U</button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 - 模拟文件目录 */}
        <aside className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Recent</h2>
          </div>
          <div className="p-2">
            {['Budget.xlsx', 'Expenses.xlsx', 'Income.xlsx', 'Investments.xlsx', 'Taxes.xlsx'].map((file) => (
              <div key={file} className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded">
                <div className="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
                <span>{file}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Folders</h2>
          </div>
          <div className="p-2">
            {['Documents', 'Downloads', 'Desktop', 'OneDrive'].map((folder) => (
              <div key={folder} className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded">
                <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
                <span>{folder}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* 主视图区 - 根据状态显示不同内容 */}
        <main className="flex-1 overflow-auto relative" onDoubleClick={handleDoubleClick}>
          {isBossMode ? (
            <FinancialReport />
          ) : activeTab === '邮件' ? (
            <EmailManager />
          ) : (
            children
          )}
        </main>
      </div>

      {/* 游戏容器 */}
      <GameContainer
        isOpen={showGameContainer}
        onClose={() => setShowGameContainer(false)}
        gameUrl="https://www.xbox.com/en-US/play"
      />
    </div>
  );
}
