'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { generateRandomComments } from './utils';

interface CommentSectionProps {
  slug: string;
  persona: string;
  industryContext: string;
}

export function CommentSection({ slug, persona, industryContext }: CommentSectionProps) {
  // 生成 2-3 条随机评论
  const commentCount = 2 + (slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 2);
  const comments = generateRandomComments(slug, commentCount);
  
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Comments</h2>
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white border border-gray-200 p-6 rounded-md"
            >
              <div className="flex items-start mb-4">
                <img 
                  src={comment.avatar} 
                  alt={comment.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{comment.name}</h4>
                  <p className="text-gray-500 text-sm">{comment.timestamp}</p>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
