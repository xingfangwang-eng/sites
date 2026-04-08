import { useState } from "react";
import { ArrowRight, Terminal, Copy, Check } from "lucide-react";

export default function SolutionVariantB() {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText('/recall-api-key-123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The Power of /recall</h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            See how our terminal simulator makes it easy to recall context with just a simple command
          </p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm text-slate-400">terminal</span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-mono">user@localhost:~$</span>
                <span className="text-slate-300 font-mono">npm install never-explain</span>
              </div>
              <div className="text-slate-400 font-mono text-sm">
                <p>Installing never-explain@1.0.0...</p>
                <p>✓ Added 12 packages, and audited 13 packages in 2.1s</p>
                <p>✓ All packages are up to date.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-mono">user@localhost:~$</span>
                <span className="text-slate-300 font-mono">/recall-api-key-123</span>
              </div>
              <div className="bg-slate-700 rounded-md p-4 font-mono text-sm text-slate-300">
                <p className="mb-2">// API Key Context</p>
                <p className="mb-2">const API_KEY = 'sk-1234567890abcdef';</p>
                <p className="mb-2">const API_BASE_URL = 'https://api.openai.com/v1';</p>
                <p>const headers = {'{'}</p>
                <p>  'Authorization': `Bearer ${'API_KEY'}`,</p>
                <p>  'Content-Type': 'application/json'</p>
                <p>{'}'};</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-mono">user@localhost:~$</span>
                <span className="text-slate-300 font-mono">echo "API key loaded successfully!"</span>
              </div>
              <div className="text-slate-400 font-mono">API key loaded successfully!</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">How to Use /recall</h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 transition-colors rounded-md text-sm"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Example
                </>
              )}
            </button>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3">
              <Terminal size={20} className="text-green-500 flex-shrink-0" />
              <span>Type <code className="bg-slate-700 px-2 py-1 rounded font-mono text-sm">/recall-{`{hook}`}</code> in any terminal or chat interface</span>
            </li>
            <li className="flex items-center gap-3">
              <Terminal size={20} className="text-green-500 flex-shrink-0" />
              <span>Our system will automatically retrieve the context associated with that hook</span>
            </li>
            <li className="flex items-center gap-3">
              <Terminal size={20} className="text-green-500 flex-shrink-0" />
              <span>Use the context to quickly recall information without having to search for it</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors active:scale-95 flex items-center gap-2 mx-auto">
            Try It Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}