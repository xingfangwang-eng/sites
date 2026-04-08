'use client';

import React, { useState, useEffect } from 'react';

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  classification: '紧急' | '稍后处理' | '无关紧要';
  reply: string;
}

export default function EmailManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  // 处理 Gmail 授权
  const handleAuth = async () => {
    try {
      const response = await fetch('/api/auth/url');
      const data = await response.json();
      if (data.authUrl) {
        // 打开授权页面
        const authWindow = window.open(data.authUrl, '_blank', 'width=600,height=400');
        
        // 监听授权回调
        const handleMessage = async (event: MessageEvent) => {
          if (event.origin === window.location.origin && event.data.tokens) {
            setCredentials(event.data.tokens);
            setIsAuthenticated(true);
            window.removeEventListener('message', handleMessage);
            authWindow?.close();
            // 获取邮件列表
            await fetchEmails(event.data.tokens);
          }
        };
        
        window.addEventListener('message', handleMessage);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  // 获取邮件列表
  const fetchEmails = async (creds: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentials: creds }),
      });
      const data = await response.json();
      if (data.emails) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  // 发送敷衍回复
  const sendReply = async (email: Email) => {
    setSending(email.id);
    try {
      // 从 from 字段中提取邮箱地址
      const toMatch = email.from.match(/<([^>]+)>/);
      const to = toMatch ? toMatch[1] : email.from;
      
      await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials,
          to,
          subject: `Re: ${email.subject}`,
          body: email.reply,
        }),
      });
      
      // 显示成功消息
      alert('回复已发送');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('发送失败，请重试');
    } finally {
      setSending(null);
    }
  };

  // 按分类分组邮件
  const groupedEmails = emails.reduce((groups, email) => {
    const classification = email.classification;
    if (!groups[classification]) {
      groups[classification] = [];
    }
    groups[classification].push(email);
    return groups;
  }, {} as Record<string, Email[]>);

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded shadow-sm p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Gmail 授权</h2>
          <p className="mb-6">请授权访问您的 Gmail 账户，以便我们可以帮您分类邮件并生成回复。</p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleAuth}
          >
            授权 Gmail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">邮件管理</h2>
          <button
            className="px-4 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors"
            onClick={() => fetchEmails(credentials)}
            disabled={loading}
          >
            {loading ? '刷新中...' : '刷新邮件'}
          </button>
        </div>
        
        <div className="p-4">
          {Object.entries(groupedEmails).map(([classification, emails]) => (
            <div key={classification} className="mb-6">
              <h3 className={`text-md font-medium mb-3 ${
                classification === '紧急' ? 'text-red-600' :
                classification === '稍后处理' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {classification} ({emails.length})
              </h3>
              <div className="space-y-2">
                {emails.map((email) => (
                  <div key={email.id} className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{email.subject}</h4>
                        <p className="text-xs text-gray-500 mt-1">{email.from}</p>
                        <p className="text-xs text-gray-500">{email.date}</p>
                      </div>
                      <button
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        onClick={() => sendReply(email)}
                        disabled={sending === email.id}
                      >
                        {sending === email.id ? '发送中...' : '一键回复'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{email.snippet}</p>
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <strong>回复内容:</strong> {email.reply}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {emails.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              暂无邮件
            </div>
          )}
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载邮件中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
