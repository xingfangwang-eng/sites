'use client';
import { useState, useEffect, useRef } from 'react';
import { Copy, Loader2, X, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Quick Access - 15 个核心关键词
const QUICK_ACCESS_KEYWORDS = [
  { slug: 'convert-curl-to-axios', title: 'Convert curl to Axios' },
  { slug: 'optimize-react-app-performance', title: 'React Performance' },
  { slug: 'secure-api-keys-nodejs', title: 'Secure API Keys' },
  { slug: 'dockerize-nodejs-app', title: 'Dockerize Node.js' },
  { slug: 'implement-jwt-authentication', title: 'JWT Authentication' },
  { slug: 'setup-mongodb-connection', title: 'MongoDB Setup' },
  { slug: 'implement-rate-limiting', title: 'Rate Limiting' },
  { slug: 'optimize-database-queries', title: 'Database Optimization' },
  { slug: 'setup-ci-cd-pipeline', title: 'CI/CD Pipeline' },
  { slug: 'implement-caching-strategy', title: 'Caching Strategy' },
  { slug: 'handle-file-uploads', title: 'File Uploads' },
  { slug: 'setup-logging-system', title: 'Logging System' },
  { slug: 'implement-webhooks', title: 'Webhooks' },
  { slug: 'optimize-bundle-size', title: 'Bundle Size' },
  { slug: 'setup-error-handling', title: 'Error Handling' }
];

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleDNA, setStyleDNA] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [showFloatingCopied, setShowFloatingCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [extractCount, setExtractCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [displayedDNA, setDisplayedDNA] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 页面加载时从 localStorage 读取数据
  useEffect(() => {
    const savedDNA = localStorage.getItem('personaLockStyleDNA');
    if (savedDNA) {
      setStyleDNA(savedDNA);
    }
    
    const savedCount = localStorage.getItem('personaLockExtractCount');
    if (savedCount) {
      setExtractCount(parseInt(savedCount));
    }
    
    const savedProStatus = localStorage.getItem('personaLockIsPro');
    if (savedProStatus === 'true') {
      setIsPro(true);
    }
  }, []);

  // 当 DNA 变化时存储到 localStorage 并触发打字机效果
  useEffect(() => {
    if (styleDNA) {
      localStorage.setItem('personaLockStyleDNA', styleDNA);
      
      // 触发打字机效果
      setIsTyping(true);
      setDisplayedDNA('');
      
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < styleDNA.length) {
          setDisplayedDNA(prev => prev + styleDNA.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15);
      
      return () => clearInterval(typingInterval);
    }
  }, [styleDNA]);

  // 当提取次数变化时存储到 localStorage
  useEffect(() => {
    localStorage.setItem('personaLockExtractCount', extractCount.toString());
  }, [extractCount]);

  // 当 Pro 状态变化时存储到 localStorage
  useEffect(() => {
    localStorage.setItem('personaLockIsPro', isPro.toString());
  }, [isPro]);

  const handleExtractStyle = async () => {
    if (!inputText.trim()) return;
    
    // 检查提取次数
    if (!isPro && extractCount >= 1) {
      setShowModal(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `你是一个顶级的语言风格分析师。请分析以下文本的 DNA，输出一份约 300 字的'创作指令'。这份指令应包含：1. 语气（如：辛辣、松弛感、专业理性）；2. 句式习惯（如：多用反问、严禁感叹号、短句多于长句）；3. 禁忌词（如：避开'总之'、'总之而言'、'首先/其次'）；4. 特殊癖好（如：喜欢用括号吐槽、喜欢中英夹杂）。\n\n输出格式必须是：'【PersonaLock 风格 DNA】\n你的风格是[描述]... \n\n【Prompt 指令集】\n在你回复我接下来的所有需求前，请严格遵守以下规则：[详细规则]...'\n\n文本内容：\n${inputText}`
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error('API 调用失败');
      }
      
      const data = await response.json();
      const generatedContent = data.content[0].text;
      setStyleDNA(generatedContent);
      
      // 增加提取次数
      setExtractCount(prev => prev + 1);
    } catch (error) {
      console.error('提取风格 DNA 失败:', error);
      setStyleDNA('提取失败，请稍后重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkAsPaid = () => {
    setIsPro(true);
    setShowModal(false);
  };

  const handleCopyToClipboard = () => {
    if (styleDNA) {
      navigator.clipboard.writeText(styleDNA);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-grid-pattern flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">PersonaLock - Lock Your Creative Soul</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Content</h2>
            <textarea
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Paste 3 paragraphs of your best historical tweets or articles..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleExtractStyle}
              disabled={isGenerating || !inputText.trim()}
              className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  DNA Sequencing...
                </>
              ) : (
                'Extract Style DNA'
              )}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 w-full py-2 border border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 hover:scale-105 transition-all flex items-center justify-center"
            >
              <Sparkles className="mr-2" size={18} />
              Generate 5 Different Style Variations
            </button>
            {/* Browse All Alternatives Button */}
            <Link
              href="/solutions/"
              className="mt-4 w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-purple-500 hover:text-purple-600 transition-all flex items-center justify-center"
            >
              Browse All Alternatives
              <ChevronRight className="ml-2" size={18} />
            </Link>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-white rounded-lg shadow p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Style DNA</h2>
              {styleDNA && (
                <button
                  onClick={handleCopyToClipboard}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title={showCopied ? "Copied" : "Copy to Clipboard"}
                >
                  <Copy size={20} className={showCopied ? "text-green-500" : "text-gray-600"} />
                </button>
              )}
            </div>
            {styleDNA ? (
              <div className="bg-gray-50 p-4 rounded-lg min-h-80 whitespace-pre-wrap font-mono">
                {displayedDNA}
                {isTyping && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg min-h-80 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🔒</div>
                  <p>Click the button on the left to extract your Style DNA</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How to Use Guide */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
            <Sparkles className="mr-2 text-purple-600" size={20} />
            How to Use PersonaLock
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mb-4">1</div>
              <h3 className="font-semibold mb-2">Upload Historical Text</h3>
              <p className="text-gray-600 text-sm">Paste 3 paragraphs of your best historical tweets or articles</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mb-4">2</div>
              <h3 className="font-semibold mb-2">Extract DNA and Copy</h3>
              <p className="text-gray-600 text-sm">Click the button to extract your Style DNA, then copy it</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mb-4">3</div>
              <h3 className="font-semibold mb-2">Go to GPT/Claude and Paste</h3>
              <p className="text-gray-600 text-sm">From now on, AI will speak like you, maintaining a consistent creative style</p>
            </div>
          </div>
        </div>

        {/* Quick Access - 15 Core Keywords */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_ACCESS_KEYWORDS.map((keyword, index) => (
              <Link
                key={index}
                href={`/${keyword.slug}/`}
                className="text-xs text-gray-500 hover:text-purple-600 transition-colors truncate"
              >
                {keyword.title}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 px-6">
        <div className="text-center space-y-1">
          <p className="text-gray-500 text-sm">No registration required, open and use. Data only exists in your local browser.</p>
          <p className="text-gray-500 text-sm">
            Support: <a href="mailto:457239850@qq.com" className="text-purple-600 hover:underline">457239850@qq.com</a>
            {' · '}
            <Link href="/sitemap" className="text-purple-600 hover:underline">Sitemap</Link>
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      {styleDNA && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white cursor-pointer transition-all duration-300 ${isHovering ? 'scale-110 shadow-lg' : ''}`}
            onClick={() => {
              if (styleDNA) {
                navigator.clipboard.writeText(styleDNA);
                setShowFloatingCopied(true);
                setTimeout(() => setShowFloatingCopied(false), 2000);
              }
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            title="Copy DNA"
          >
            <Copy size={24} />
          </div>
          {isHovering && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
              Copy DNA
            </div>
          )}
          {showFloatingCopied && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
              DNA Copied!
            </div>
          )}
        </div>
      )}

      {/* Upgrade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Sparkles className="mr-2 text-purple-600" size={24} />
                Upgrade to PersonaLock Pro
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Unlocked Benefits</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    Unlock 5 DNA deep extraction credits
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    Support for multiple persona switching
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">One-time fee</p>
                <p className="text-3xl font-bold text-purple-600">$6.9</p>
              </div>
              <div className="space-y-3">
                <p className="text-center text-gray-600">Click the button below to complete PayPal payment</p>
                <a
                  href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=xingfang.wang@gmail.com&amount=6.90&currency_code=USD&item_name=PersonaLock%20Pro%20Upgrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.076 18.375c0 .716-.584 1.299-1.299 1.299-.715 0-1.299-.583-1.299-1.299 0-.715.584-1.299 1.299-1.299.715 0 1.299.584 1.299 1.299zm-2.598-13.952c0-.715-.584-1.299-1.299-1.299-.715 0-1.299.584-1.299 1.299 0 .716.584 1.299 1.299 1.299.715 0 1.299-.583 1.299-1.299zm-4.074 11.845c0 .716-.584 1.299-1.299 1.299-.715 0-1.299-.583-1.299-1.299 0-.715.584-1.299 1.299-1.299.715 0 1.299.584 1.299 1.299zm-4.373-4.162c0 .716-.584 1.299-1.299 1.299-.715 0-1.299-.583-1.299-1.299 0-.715.584-1.299 1.299-1.299.715 0 1.299.584 1.299 1.299zm-4.537 1.962c0 .716-.584 1.299-1.299 1.299-.715 0-1.299-.583-1.299-1.299 0-.715.584-1.299 1.299-1.299.715 0 1.299.584 1.299 1.299zm-2.098-6.488c0 .716-.584 1.299-1.299 1.299-.715 0-1.299-.583-1.299-1.299 0-.715.584-1.299 1.299-1.299.715 0 1.299.584 1.299 1.299zM21.84 9.77c.584 0 1.06-.476 1.06-1.06 0-.583-.476-1.06-1.06-1.06-.584 0-1.06.477-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-1.06 9.135c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-5.183.53c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-8.347 0c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-3.233-4.845c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm13.952-5.183c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-8.913 0c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-4.537 2.098c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm4.537-6.488c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06zm-4.537 0c.584 0 1.06-.476 1.06-1.06 0-.584-.476-1.06-1.06-1.06-.584 0-1.06.476-1.06 1.06 0 .584.476 1.06 1.06 1.06z"/>
                  </svg>
                  PayPal Payment
                </a>
                <button
                  onClick={handleMarkAsPaid}
                  className="w-full py-2 border border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 hover:scale-105 transition-all"
                >
                  I've Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
