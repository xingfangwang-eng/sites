'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/src/types/note';
import { getAllNotes, saveNote, deleteNote, getNoteById, toggleFavorite } from '@/src/services/noteService';
import { Search, Plus, Star, StarOff, Trash2, Tag, Menu, X, Moon, Sun } from 'lucide-react';

const NoteAppLayout: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('all'); // all, favorite, trash

  // 加载笔记
  useEffect(() => {
    const loadNotes = () => {
      const loadedNotes = getAllNotes();
      setNotes(loadedNotes);
    };

    loadNotes();
    
    // 检查系统暗色模式偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // 应用暗色模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    if (activeView === 'favorite' && !note.isFavorite) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
    }
    return true;
  });

  // 创建新笔记
  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      tags: [],
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const savedNote = saveNote(newNote);
    setNotes([...notes, savedNote]);
    setSelectedNote(savedNote);
  };

  // 更新笔记
  const handleUpdateNote = (note: Note) => {
    const savedNote = saveNote(note);
    setNotes(notes.map(n => n.id === note.id ? savedNote : n));
    setSelectedNote(savedNote);
  };

  // 处理笔记删除
  const handleDeleteNote = (id: string) => {
    if (deleteNote(id)) {
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  };

  // 处理收藏切换
  const handleToggleFavorite = (id: string) => {
    const updatedNote = toggleFavorite(id);
    if (updatedNote) {
      setNotes(notes.map(n => n.id === id ? updatedNote : n));
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNote);
      }
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* 背景渐变 */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30' : 'bg-gradient-to-br from-indigo-100/50 via-purple-100/50 to-pink-100/50'}`}></div>
      </div>

      {/* 侧边栏 */}
      <aside className={`fixed md:relative z-10 w-64 h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out`}>
        <div className={`h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
          {/* 侧边栏头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">NoteApp</h1>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 搜索框 */}
          <div className="p-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-1">
            <button 
              onClick={() => setActiveView('all')} 
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeView === 'all' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <div className="w-6 text-center">📝</div>
              <span>All Notes</span>
            </button>
            <button 
              onClick={() => setActiveView('favorite')} 
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeView === 'favorite' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Star size={18} />
              <span>Favorites</span>
            </button>
            <button 
              onClick={() => setActiveView('tags')} 
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeView === 'tags' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Tag size={18} />
              <span>Tags</span>
            </button>
            <button 
              onClick={() => setActiveView('trash')} 
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeView === 'trash' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Trash2 size={18} />
              <span>Trash</span>
            </button>
          </nav>

          {/* 侧边栏底部 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* 顶部导航 */}
        <header className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-medium">{selectedNote ? 'Edit Note' : 'Notes'}</h2>
          <button 
            onClick={handleCreateNote} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Plus size={18} />
            <span>New Note</span>
          </button>
        </header>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto">
          {selectedNote ? (
            /* 编辑区 */
            <div className="p-6 max-w-3xl mx-auto">
              <input 
                type="text" 
                value={selectedNote.title} 
                onChange={(e) => handleUpdateNote({ ...selectedNote, title: e.target.value })}
                className="w-full text-2xl font-bold mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                placeholder="Note title"
              />
              <textarea 
                value={selectedNote.content} 
                onChange={(e) => handleUpdateNote({ ...selectedNote, content: e.target.value })}
                className="w-full h-[calc(100vh-200px)] bg-transparent border-none focus:outline-none resize-none"
                placeholder="Start writing..."
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleFavorite(selectedNote.id)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {selectedNote.isFavorite ? <Star size={20} className="text-yellow-500" /> : <StarOff size={20} />}
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {selectedNote.updatedAt.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            /* 笔记列表 */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <div 
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(note.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {note.isFavorite ? <Star size={16} className="text-yellow-500" /> : <StarOff size={16} />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {note.content || 'No content'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{note.createdAt.toLocaleDateString()}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredNotes.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Start creating your first note</p>
                    <button 
                      onClick={handleCreateNote} 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      <Plus size={18} />
                      <span>Create Note</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NoteAppLayout;
