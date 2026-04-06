'use client';

import React from 'react';

interface MessageCardProps {
  avatar: string;
  username: string;
  handle?: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
  onClick: () => void;
}

const MessageCard = React.memo(function MessageCard({
  avatar,
  username,
  handle,
  content,
  timestamp,
  isUnread,
  onClick,
}: MessageCardProps) {
  return (
    <div
      onClick={onClick}
      className={`mb-4 p-3 border rounded hover:bg-white/5 transition-colors cursor-pointer ${
        isUnread ? 'border-white/30 bg-white/5' : 'border-white/10'
      }`}
    >
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
          {avatar ? (
            <img src={avatar} alt={username} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-sm">{username.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-medium">{username}</span>
            {handle && (
              <span className="text-gray-400 text-xs ml-2">{handle}</span>
            )}
            {isUnread && (
              <span className="ml-2 w-2 h-2 rounded-full bg-blue-500"></span>
            )}
          </div>
          <p className="text-sm mb-2">{content}</p>
          <div className="flex items-center text-xs text-gray-400">
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MessageCard;