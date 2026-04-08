"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

// 详细背景内容
const NEXTJS_CONTEXT = `I'm working on a Next.js 15 project with Tailwind CSS, Lucide Icons, and the new App Router architecture. The project uses TypeScript 5.6, shadcn/ui components, and follows the latest React 19 patterns. We're implementing a context management system with /recall hooks that sync across ChatGPT and Claude. The tech stack includes Prisma ORM with SQLite, NextAuth.js for authentication, and Vercel for deployment. Our goal is to reduce context fatigue by 80% through intelligent context hooks.`;

// 默认文本
const DEFAULT_TEXT = "I'm working on a [Nextjs project]...";
const RECALL_TEXT = "/recall-nextjs";

export default function LiveDemoSimulator() {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<"typing" | "deleting" | "typing-recall" | "expanded" | "done">("typing");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const textRef = useRef<HTMLDivElement>(null);

  // 闪烁光标
  useEffect(() => {
    if (isPlaying && phase !== "done") {
      const interval = setInterval(() => {
        setCursorVisible((v) => !v);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [isPlaying, phase]);

  // 重置演示
  const resetDemo = () => {
    setDisplayText("");
    setPhase("typing");
    setIsPlaying(true);
  };

  // 打字效果
  useEffect(() => {
    if (!isPlaying) return;

    if (phase === "typing") {
      if (displayText.length < DEFAULT_TEXT.length) {
        const timer = setTimeout(() => {
          setDisplayText(DEFAULT_TEXT.slice(0, displayText.length + 1));
        }, 70);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setPhase("deleting");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }

    if (phase === "deleting") {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(DEFAULT_TEXT.slice(0, displayText.length - 1));
        }, 40);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setPhase("typing-recall");
        }, 300);
        return () => clearTimeout(timer);
      }
    }

    if (phase === "typing-recall") {
      if (displayText.length < RECALL_TEXT.length) {
        const timer = setTimeout(() => {
          setDisplayText(RECALL_TEXT.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setPhase("expanded");
          setDisplayText(NEXTJS_CONTEXT);
        }, 600);
        return () => clearTimeout(timer);
      }
    }

    if (phase === "expanded") {
      const timer = setTimeout(() => {
        setPhase("done");
        setIsPlaying(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [displayText, phase, isPlaying]);

  // 滚动到底部
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [displayText]);

  return (
    <div className="w-full mb-16">
      <div className="bg-white border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1 h-8 bg-red-600"></div>
          <h2 className="text-2xl font-bold text-slate-900">
            See It In Action
          </h2>
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Replay Demo
          </button>
        </div>

        {/* ChatGPT 风格的模拟对话框 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-md overflow-hidden">
            {/* 头部 */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-sm text-slate-500 font-medium">ChatGPT</span>
              <div className="w-16"></div>
            </div>

            {/* 对话区域 */}
            <div className="p-6 min-h-[320px]">
              <div
                ref={textRef}
                className={`max-w-3xl ml-auto bg-white border border-slate-200 rounded-md p-4 ${phase === "expanded" || phase === "done" ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <div className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {displayText}
                  {isPlaying && phase !== "done" && (
                    <span
                      className={`inline-block w-2 h-5 bg-slate-800 ml-1 align-middle ${cursorVisible ? "opacity-100" : "opacity-0"}`}
                      style={{ transition: "opacity 0.2s" }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 底部输入区域 */}
            <div className="border-t border-slate-200 p-4">
              <div className="bg-white border border-slate-200 rounded-md p-4 flex items-end gap-3">
                <div className="flex-1 min-h-[44px] text-slate-400">
                  {phase === "done" ? "Send a message..." : "Simulating input..."}
                </div>
                <button className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* CTA 按钮 */}
          {phase === "done" && (
            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-colors active:scale-95"
              >
                Get this workflow for free
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
