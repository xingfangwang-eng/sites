import { useState, useRef } from 'react';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    lexicalFingerprint: '正在分析...',
    emotionalCurve: '正在分析...',
    sentenceStructure: '正在分析...',
    narrativeFramework: '正在分析...',
  });
  const [downloadUrl, setDownloadUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === 'text/plain' || file.type === 'text/markdown' || file.name.endsWith('.md')
      );
      setFiles(validFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter(
        (file) => file.type === 'text/plain' || file.type === 'text/markdown' || file.name.endsWith('.md')
      );
      setFiles(validFiles);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setPaymentComplete(false);

    try {
      let textToAnalyze = textInput;
      
      if (files.length > 0) {
        const fileContents = [];
        for (const file of files) {
          const content = await file.text();
          fileContents.push(content);
        }
        textToAnalyze = fileContents.join('\n\n');
      }
      
      if (!textToAnalyze) {
        alert('请上传文件或输入文本');
        setIsAnalyzing(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setAnalysisResults({
        lexicalFingerprint: '科技、创新、未来',
        emotionalCurve: '积极、乐观、激励',
        sentenceStructure: '短句为主，节奏感强',
        narrativeFramework: '情感共鸣→数据支撑→未来展望',
      });
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('分析错误:', error);
      alert('分析失败，请重试');
      setIsAnalyzing(false);
    }
  };

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentComplete(true);
      setDownloadUrl('/api/download/capsule?sessionId=test&filename=StyleCapsule_Capsule.zip');
    }, 1000);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 font-sans"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    >
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">Capsule Factory</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                关于
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                定价
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                联系我们
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            提取你的语言DNA，创建专属风格胶囊
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            上传你的文本或粘贴推文，我们将分析你的语言风格，生成个性化的风格胶囊，让AI模仿你的独特表达。
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">上传你的文本</h3>
          
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept=".txt,.md,text/plain,text/markdown"
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-slate-600 mb-2">拖拽文件到此处，或点击上传</p>
              <p className="text-sm text-slate-500">支持 .txt 和 .md 文件</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-medium mb-2">
              或粘贴推文文本流（100篇推文）
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows={10}
              value={textInput}
              onChange={handleTextInputChange}
              placeholder="在此粘贴你的推文文本..."
            />
          </div>

          {files.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-2">已上传文件：</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-700">{file.name}</span>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!files.length && !textInput)}
          >
            {isAnalyzing ? '分析中...' : '开始分析'}
          </button>
        </div>

        {isAnalyzing && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">正在提取语言 DNA...</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">词汇指纹：</span>
                <span className="text-slate-900 font-medium">{analysisResults.lexicalFingerprint}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">情绪曲线：</span>
                <span className="text-slate-900 font-medium">{analysisResults.emotionalCurve}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">句式结构：</span>
                <span className="text-slate-900 font-medium">{analysisResults.sentenceStructure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">叙事框架：</span>
                <span className="text-slate-900 font-medium">{analysisResults.narrativeFramework}</span>
              </div>
              <div className="mt-8">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-slate-500 mt-3 text-center">正在分析语言风格，预计需要30秒...</p>
              </div>
            </div>
          </div>
        )}

        {analysisComplete && !paymentComplete && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">DNA 报告概览</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">词汇指纹：</span>
                <span className="text-slate-900 font-medium">{analysisResults.lexicalFingerprint}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">情绪曲线：</span>
                <span className="text-slate-900 font-medium">{analysisResults.emotionalCurve}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">句式结构：</span>
                <span className="text-slate-900 font-medium">{analysisResults.sentenceStructure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">叙事框架：</span>
                <span className="text-slate-900 font-medium">{analysisResults.narrativeFramework}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-medium mb-2">
                请输入邮箱（支付后将发送下载链接）
              </label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={userEmail}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-slate-900 mb-6">支付 $49.00 USD 激活并下载逻辑胶囊</p>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm"
                onClick={handlePayment}
              >
                立即支付
              </button>
            </div>
          </div>
        )}

        {paymentComplete && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">支付成功！</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">词汇指纹：</span>
                <span className="text-slate-900 font-medium">{analysisResults.lexicalFingerprint}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">情绪曲线：</span>
                <span className="text-slate-900 font-medium">{analysisResults.emotionalCurve}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">句式结构：</span>
                <span className="text-slate-900 font-medium">{analysisResults.sentenceStructure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">叙事框架：</span>
                <span className="text-slate-900 font-medium">{analysisResults.narrativeFramework}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
              <h4 className="text-xl font-semibold text-slate-900 mb-4">胶囊使用手册</h4>
              <ol className="list-decimal list-inside space-y-3 text-slate-700">
                <li>下载逻辑胶囊压缩包</li>
                <li>解压缩文件到一个文件夹</li>
                <li>将解压后的文件夹拖入 Trae/Cursor 根目录</li>
                <li>重启 Trae/Cursor 应用</li>
                <li>在编辑器中输入 <code className="bg-slate-200 px-1 py-0.5 rounded">/style-on</code> 激活胶囊</li>
                <li>开始使用大V风格进行内容创作</li>
              </ol>
            </div>
            
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-sm"
              onClick={handleDownload}
            >
              下载逻辑胶囊
            </button>
            <p className="text-sm text-slate-500 mt-4 text-center">下载链接将在24小时后失效</p>
            <p className="text-sm text-slate-500 mt-2 text-center">我们已向您的邮箱发送了包含下载链接和安装说明的邮件</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-slate-900">Capsule Factory</h2>
              <p className="text-sm text-slate-600">© 2026 All rights reserved</p>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                服务条款
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                常见问题
              </a>
              <a href="mailto:457239850@qq.com" className="text-slate-600 hover:text-slate-900 transition-colors">
                Support: 457239850@qq.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
