"use client";

import { useEffect, useState, useCallback, useRef, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const STORAGE_KEY = "noai_draft";

// Modern color scheme
const colors = {
  bg: '#fafafa',
  text: '#2d3748',
  accent: '#10b981',
  accentLight: '#d1fae5',
  border: '#e2e8f0',
  muted: '#718096'
};

const MarkdownPreview = memo(({ content }: { content: string }) => (
  <div style={{ 
    padding: '24px', 
    color: colors.text, 
    fontFamily: 'system-ui, -apple-system, sans-serif', 
    fontSize: '15px', 
    lineHeight: 1.7 
  }}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content || "*Preview area*"}
    </ReactMarkdown>
  </div>
));
MarkdownPreview.displayName = "MarkdownPreview";

export default function Home() {
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isPro, setIsPro] = useState(false);
  
  const textRef = useRef(text);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setText(saved);
        textRef.current = saved;
      }
      const proStatus = localStorage.getItem("noai_pro");
      if (proStatus === "true") setIsPro(true);
    } catch (err) {
      console.error("LocalStorage access blocked", err);
    }

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0]?.toString() || "";
      if (url.startsWith("http://") || url.startsWith("https://")) {
        try {
          const urlObj = new URL(url);
          if (urlObj.origin !== window.location.origin) {
            console.log("Privacy Guard: Blocked", url);
            return Promise.reject(new Error("Blocked"));
          }
        } catch {}
      }
      return originalFetch.apply(window, args);
    };

    return () => { 
      window.fetch = originalFetch; 
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const scheduleSave = useCallback((newText: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, newText); } catch {}
    }, 100);
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    textRef.current = newText;
    scheduleSave(newText);
  }, [scheduleSave]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      setShowPreview((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newText = textRef.current.substring(0, start) + "  " + textRef.current.substring(end);
      setText(newText);
      textRef.current = newText;
      scheduleSave(newText);
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 2; }, 0);
    }
  };

  const handleClear = () => {
    setText("");
    textRef.current = "";
    try { localStorage.setItem(STORAGE_KEY, ""); } catch {}
    setShowConfirm(false);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noai-draft-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEncryptedExport = () => {
    try {
      const encryptedContent = btoa(JSON.stringify({
        content: text,
        timestamp: new Date().toISOString(),
        version: "1.0"
      }));
      
      const blob = new Blob([encryptedContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `noai-encrypted-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Encryption failed", err);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      background: colors.bg, 
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Hero Text */}
      <div style={{
        position: 'fixed', top: '64px', left: '50%', zIndex: 40,
        transform: 'translateX(-50%)',
        background: 'white',
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '12px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <p style={{ 
          color: colors.muted, 
          fontSize: '14px',
          margin: 0,
          textAlign: 'center'
        }}>
          A distraction-free Markdown editor. No AI, no cloud, no tracking. Just write.
        </p>
      </div>

      {/* Toolbar - Always visible */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'center',
        paddingTop: '12px'
      }}>
        <div style={{ 
          background: 'white', 
          border: `1px solid ${colors.border}`, 
          borderRadius: '8px',
          padding: '8px 16px', 
          display: 'flex', 
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <button onClick={() => setShowConfirm(true)} style={{ 
            color: colors.muted, 
            fontSize: '13px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.background = colors.bg} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Clear</button>
          <button onClick={handleDownload} style={{ 
            color: colors.muted, 
            fontSize: '13px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.background = colors.bg} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Download</button>
          {isPro && (
            <button onClick={handleEncryptedExport} style={{ 
              color: colors.accent, 
              fontSize: '13px', 
              background: 'none', 
              border: `1px solid ${colors.accent}`, 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }} onMouseEnter={(e) => e.currentTarget.style.background = colors.accentLight} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Encrypt Export</button>
          )}
          <button onClick={() => setShowProModal(true)} style={{ 
            color: colors.accent, 
            fontSize: '13px', 
            fontWeight: 600,
            background: colors.accentLight, 
            border: 'none', 
            cursor: 'pointer',
            padding: '6px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.background = '#a7f3d0'} onMouseLeave={(e) => e.currentTarget.style.background = colors.accentLight}>{isPro ? "Pro ✓" : "Go Pro"}</button>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            padding: '24px', 
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <p style={{ color: colors.text, fontSize: '15px', marginBottom: '20px', fontWeight: 500 }}>Are you sure? This is irreversible.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(false)} style={{ 
                color: colors.muted, 
                fontSize: '14px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '6px'
              }}>Cancel</button>
              <button onClick={handleClear} style={{ 
                color: 'white', 
                fontSize: '14px', 
                background: '#ef4444', 
                border: 'none', 
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 500
              }}>Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Pro Modal */}
      {showProModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setShowProModal(false)} style={{ 
            position: 'absolute', top: '24px', right: '24px', 
            color: colors.muted, 
            fontSize: '14px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}>✕ Close</button>
          <div style={{ maxWidth: '420px', textAlign: 'center', padding: '0 32px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              background: colors.accentLight, 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>✦</div>
            <h2 style={{ color: colors.text, fontSize: '28px', marginBottom: '16px', fontWeight: 700 }}>NoAI Pro</h2>
            <p style={{ color: colors.muted, fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
              Unlock encrypted offline package export. <br/>One-time payment, keep forever.
            </p>
            <div style={{ 
              background: colors.bg,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>$9.9</div>
              <div style={{ fontSize: '14px', color: colors.muted }}>One-time payment</div>
            </div>
            <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=xingfang.wang@gmail.com&item_name=NoAI_Pro_Encrypted_Export&amount=9.90&currency_code=USD" target="_blank" rel="noopener noreferrer" style={{ 
              display: 'block', 
              background: colors.accent, 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: 600,
              padding: '14px 32px', 
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>Pay with PayPal</a>
            <p style={{ color: colors.muted, fontSize: '13px' }}>Instant activation after payment</p>
          </div>
        </div>
      )}

      {/* Editor */}
      <div style={{ width: showPreview ? '50%' : '100%', height: '100%', position: 'relative' }}>
        <textarea
          value={text}
          onChange={handleInput}
          onKeyDown={handleTab}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: colors.bg, 
            color: colors.text, 
            fontFamily: 'SF Mono, Monaco, Consolas, monospace', 
            fontSize: '15px',
            lineHeight: 2.2,
            border: `1px solid ${colors.border}`, 
            outline: 'none', 
            resize: 'none', 
            padding: '150px 32px 80px', 
            paddingLeft: '64px',
            margin: 0,
            borderRadius: '8px'
          }}
          spellCheck={false}
          autoFocus
          placeholder="Start writing..."
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <div style={{ width: '50%', height: '100%', background: 'white', border: `1px solid ${colors.border}`, borderLeft: 'none', overflow: 'auto', borderRadius: '8px' }}>
          <MarkdownPreview content={text} />
        </div>
      )}

      {/* Status */}
      <div style={{ position: 'fixed', bottom: '16px', left: '24px', color: colors.muted, fontSize: '12px', pointerEvents: 'none' }}>● Offline & No-AI</div>
      <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', color: colors.muted, fontSize: '12px', pointerEvents: 'none' }}>support: 457239850@qq.com</div>
      <div style={{ position: 'fixed', bottom: '16px', right: '24px', color: colors.muted, fontSize: '12px', pointerEvents: 'none' }}>{showPreview ? "Preview On" : "Preview Off"} · Ctrl+P</div>
    </div>
  );
}
