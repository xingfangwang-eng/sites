import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 调用 Reddit API
    const redditResponse = await axios.get('https://www.reddit.com/search.json', {
      params: {
        q: query,
        limit: 5,
      },
    });

    const redditPosts = redditResponse.data.data.children;
    const results = [];

    // 处理前 3 个结果
    for (let i = 0; i < Math.min(3, redditPosts.length); i++) {
      const post = redditPosts[i];
      const content = post.data.selftext || post.data.title;

      // 使用 GPT-4o-mini 过滤内容
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '识别并剔除包含 Affiliate Link、SEO 软文、或是以 Top 10 开头的营销清单。只保留带有个人情绪、具体痛点或真实使用体验的段落。',
          },
          {
            role: 'user',
            content: content,
          },
        ],
      });

      const filteredContent = gptResponse.choices[0]?.message?.content || content;

      results.push({
        id: post.data.id || `result-${i}`,
        title: post.data.title || `Result ${i + 1}`,
        content: filteredContent,
        isPremium: false,
      });
    }

    // 添加第 4 个付费结果
    results.push({
      id: 'premium-result',
      title: 'Premium Result: Deep AI Analysis',
      content: 'This is premium content that requires payment to access. It contains deep AI analysis and避雷报告.',
      isPremium: true,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    
    // 模拟数据作为 fallback
    const mockResults = [
      {
        id: '1',
        title: 'How to improve SEO',
        content: 'I had a tough time with SEO until I started focusing on quality content and natural backlinks. It took time but the results were worth it.',
        isPremium: false,
      },
      {
        id: '2',
        title: 'Best tools for content creation',
        content: 'After trying many tools, I found that simplicity is key. The best tool is the one you actually use consistently.',
        isPremium: false,
      },
      {
        id: '3',
        title: 'My experience with no-code tools',
        content: 'No-code tools have been a game-changer for me. I was able to build a functional website without writing a single line of code.',
        isPremium: false,
      },
      {
        id: 'premium-result',
        title: 'Premium Result: Deep AI Analysis',
        content: 'This is premium content that requires payment to access. It contains deep AI analysis and避雷报告.',
        isPremium: true,
      },
    ];

    return NextResponse.json(mockResults);
  }
}
