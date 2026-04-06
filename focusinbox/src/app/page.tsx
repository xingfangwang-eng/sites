'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MessageCard from '../components/MessageCard';
import ReplyInput from '../components/ReplyInput';
import Banner from '../components/Banner';
import Overlay from '../components/Overlay';
import { fetchTwitterMentions, fetchLinkedInMessages, sendTwitterReply, sendLinkedInReply } from '../services/api';

interface Message {
  id: string;
  username: string;
  handle?: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
}

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [twitterApiKey, setTwitterApiKey] = useState('');
  const [linkedinApiKey, setLinkedinApiKey] = useState('');
  
  // Message data
  const [twitterMessages, setTwitterMessages] = useState<Message[]>([]);
  const [linkedinMessages, setLinkedinMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter state
  const [onlyUnreadTwitter, setOnlyUnreadTwitter] = useState(false);
  const [onlyUnreadLinkedIn, setOnlyUnreadLinkedIn] = useState(false);
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<{ platform: 'twitter' | 'linkedin'; id: string } | null>(null);
  
  // Overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  
  // Mobile platform switcher
  const [mobilePlatform, setMobilePlatform] = useState<'twitter' | 'linkedin'>('twitter');

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const twitterData = await fetchTwitterMentions();
        const linkedinData = await fetchLinkedInMessages();
        setTwitterMessages(twitterData);
        setLinkedinMessages(linkedinData);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Logic to show overlay every 5 minutes (simulating unpaid state)
  useEffect(() => {
    // Check if paid (simulating unpaid state here)
    const isPaid = localStorage.getItem('isPaid') === 'true';
    
    if (!isPaid) {
      // Show overlay initially
      setShowOverlay(true);
      
      // Show overlay every 5 minutes
      const interval = setInterval(() => {
        setShowOverlay(true);
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    // Save API Keys logic can be added here
    setShowSettings(false);
  };

  // Mark message as read
  const markAsRead = useCallback((platform: 'twitter' | 'linkedin', id: string) => {
    const setter = platform === 'twitter' ? setTwitterMessages : setLinkedinMessages;
    setter(prev => prev.map(msg => msg.id === id ? { ...msg, isUnread: false } : msg));
  }, []);

  // Handle message click
  const handleMessageClick = useCallback((platform: 'twitter' | 'linkedin', id: string) => {
    setReplyingTo({ platform, id });
    markAsRead(platform, id);
  }, [markAsRead]);

  // Handle send reply
  const handleSendReply = useCallback(async (message: string) => {
    if (!replyingTo) return;
    
    if (replyingTo.platform === 'twitter') {
      await sendTwitterReply(replyingTo.id, message);
    } else {
      await sendLinkedInReply(replyingTo.id, message);
    }
    
    setReplyingTo(null);
  }, [replyingTo]);

  // Filter messages
  const filteredTwitterMessages = onlyUnreadTwitter 
    ? twitterMessages.filter(msg => msg.isUnread)
    : twitterMessages;
  
  const filteredLinkedInMessages = onlyUnreadLinkedIn 
    ? linkedinMessages.filter(msg => msg.isUnread)
    : linkedinMessages;

  return (
    <div className="h-screen w-full flex flex-col bg-black text-white">
      {/* Yellow Banner */}
      <Banner onOverlayShow={() => setShowOverlay(true)} />
      
      {/* Top Settings Button */}
      <header className="h-16 flex items-center justify-end px-6 border-b border-white/10">
        <button
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
          aria-expanded={showSettings}
          className="px-4 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
        >
          Settings
        </button>
      </header>
      
      {/* Transparent Overlay */}
      {showOverlay && (
        <Overlay onClose={() => setShowOverlay(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-white/10">
            <h2 className="text-xl font-medium mb-4">API Keys</h2>
            <form onSubmit={handleSaveApiKeys}>
              <div className="mb-4">
                <label className="block mb-2 text-sm">Twitter API Key</label>
                <input
                  type="text"
                  value={twitterApiKey}
                  onChange={(e) => setTwitterApiKey(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm">LinkedIn API Key</label>
                <input
                  type="text"
                  value={linkedinApiKey}
                  onChange={(e) => setLinkedinApiKey(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area - Split Layout */}
      <main className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Mobile Platform Switcher */}
        <div className="md:hidden flex border-b border-white/10">
          <button
            onClick={() => setMobilePlatform('twitter')}
            className={`flex-1 py-3 text-center ${mobilePlatform === 'twitter' ? 'bg-white/10' : ''}`}
          >
            𝕏 Twitter
          </button>
          <button
            onClick={() => setMobilePlatform('linkedin')}
            className={`flex-1 py-3 text-center ${mobilePlatform === 'linkedin' ? 'bg-white/10' : ''}`}
          >
            LinkedIn
          </button>
        </div>
        
        {/* Left Twitter Activity */}
        <div className={`sidebar flex flex-col border-r border-white/10 md:border-r-0 ${mobilePlatform === 'twitter' ? 'flex-1' : 'hidden md:flex md:w-1/2'}`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-medium">𝕏 (Twitter) Activity</h2>
            <div className="flex items-center">
              <span className="text-sm mr-2">Only Unread</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyUnreadTwitter}
                  onChange={(e) => setOnlyUnreadTwitter(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/20"></div>
              </label>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">Loading...</div>
              </div>
            ) : filteredTwitterMessages.length === 0 ? (
              <div className="text-center text-gray-400 p-4">No messages</div>
            ) : (
              filteredTwitterMessages.map((message) => (
                <div key={message.id}>
                  <MessageCard
                    avatar=""
                    username={message.username}
                    handle={message.handle}
                    content={message.content}
                    timestamp={message.timestamp}
                    isUnread={message.isUnread}
                    onClick={() => handleMessageClick('twitter', message.id)}
                  />
                  {replyingTo?.platform === 'twitter' && replyingTo.id === message.id && (
                    <ReplyInput
                      onClose={() => setReplyingTo(null)}
                      onSend={handleSendReply}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right LinkedIn Activity */}
        <div className={`sidebar flex flex-col ${mobilePlatform === 'linkedin' ? 'flex-1' : 'hidden md:flex md:w-1/2'}`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-medium">Linked🗂 (LinkedIn) Activity</h2>
            <div className="flex items-center">
              <span className="text-sm mr-2">Only Unread</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyUnreadLinkedIn}
                  onChange={(e) => setOnlyUnreadLinkedIn(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/20"></div>
              </label>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">Loading...</div>
              </div>
            ) : filteredLinkedInMessages.length === 0 ? (
              <div className="text-center text-gray-400 p-4">No messages</div>
            ) : (
              filteredLinkedInMessages.map((message) => (
                <div key={message.id}>
                  <MessageCard
                    avatar=""
                    username={message.username}
                    content={message.content}
                    timestamp={message.timestamp}
                    isUnread={message.isUnread}
                    onClick={() => handleMessageClick('linkedin', message.id)}
                  />
                  {replyingTo?.platform === 'linkedin' && replyingTo.id === message.id && (
                    <ReplyInput
                      onClose={() => setReplyingTo(null)}
                      onSend={handleSendReply}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Bottom Floating Text */}
      <footer className="h-10 flex items-center justify-center text-xs text-gray-500">
        <p>Stay Focused. No Feeds Allowed.</p>
      </footer>
    </div>
  );
}
