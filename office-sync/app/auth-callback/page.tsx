'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (code) {
        try {
          // 发送授权码到 API 端点获取令牌
          const response = await fetch(`/api/auth/callback?code=${code}`);
          const data = await response.json();
          
          if (data.tokens) {
            // 将令牌发送回主窗口
            window.opener?.postMessage({ tokens: data.tokens }, window.location.origin);
          }
        } catch (error) {
          console.error('Error handling auth callback:', error);
        }
      }
    };

    handleAuthCallback();
  }, [code]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold mb-2">授权中...</h2>
        <p className="text-gray-600">请稍候，正在处理您的授权请求...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-screen bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
