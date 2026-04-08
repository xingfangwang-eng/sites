'use client';

import { useState, useEffect, useRef } from 'react';
import { getMemories, isDevelopment } from '@/lib/firebase';
import { Memory } from '@/lib/firebase';

export default function Dashboard() {
  const [memories, setMemories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [memoryCount, setMemoryCount] = useState(0);
  const uid = useRef('test-user'); // 实际应用中应该从认证状态获取

  // 获取记忆数据和用户状态
  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取模拟记忆数据
        const memoryList = await getMemories(uid.current);
        setMemories(memoryList);
        setMemoryCount(memoryList.length);
        // 模拟用户状态
        setIsPro(false);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 过滤搜索结果
  const filteredMemories = memories.filter((memory) =>
    memory.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 复制到剪贴板
  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  // 删除记忆
  const deleteMemory = (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      if (isDevelopment) {
        // 模拟删除记忆
        setMemories(prevMemories => prevMemories.filter(memory => memory.id !== id));
        setMemoryCount(prevCount => prevCount - 1);
        console.log('Mock deleteMemory:', id);
      } else {
        // 实际删除记忆
        const { database, ref, remove } = require('firebase/database');
        const memoryRef = ref(database, `users/${uid.current}/memories/${id}`);
        remove(memoryRef);
      }
    }
  };

  // 清空所有记忆
  const clearAllMemories = () => {
    if (confirm('Are you sure you want to clear all memories? This action cannot be undone.')) {
      if (isDevelopment) {
        // 模拟清空所有记忆
        setMemories([]);
        setMemoryCount(0);
        console.log('Mock clearAllMemories');
      } else {
        // 实际清空所有记忆
        const { database, ref, remove } = require('firebase/database');
        const memoriesRef = ref(database, `users/${uid.current}/memories`);
        remove(memoriesRef);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            {!isPro && memoryCount >= 5 && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm">
                Memory full, upgrade to Bridge the gap
              </div>
            )}
            <button
              onClick={clearAllMemories}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Clear All Memories
            </button>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search memory content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* 时间轴视图 */}
        <div className="relative">
          {/* 时间轴中心线 */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : filteredMemories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? 'No matching memories found' : 'No memories yet, start adding!'}  
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div key={memory.id} className="relative mb-8">
                {/* 时间轴节点 */}
                <div className="absolute left-5 w-3 h-3 rounded-full bg-indigo-500 transform -translate-x-1/2"></div>

                {/* 记忆内容 */}
                <div className="ml-16 bg-card rounded-lg p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground mb-2 md:mb-0">
                      {new Date(memory.timestamp).toLocaleString()}
                    </div>
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mb-4 text-sm line-clamp-3">
                    {memory.content}
                  </div>
                  <button
                    onClick={() => copyToClipboard(memory.content)}
                    className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-colors"
                  >
                    Copy for Prompt
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}