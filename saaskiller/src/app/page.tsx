"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { parseAndAnalyzeCSV, AnalysisResult } from "@/lib/parser";
import { ResultsPanel } from "@/components/ResultsPanel";

function WastedCounter() {
  const [count, setCount] = useState(1248390);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 10) + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  return (
    <div className="text-center mb-12">
      <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
        Total Money Wasted Globally
      </p>
      <p className="text-4xl md:text-5xl font-bold text-warning-red">
        ${formatNumber(count)}
      </p>
    </div>
  );
}

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  isLoading: boolean;
}

function DropZone({ onFileDrop, isLoading }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith(".csv")) {
          onFileDrop(file);
        }
      }
    },
    [onFileDrop]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileDrop(files[0]);
      }
    },
    [onFileDrop]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full max-w-2xl mx-auto p-12 md:p-16 border-4 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
        isDragging
          ? "border-warning-red bg-warning-red/10 scale-105"
          : "border-gray-600 hover:border-warning-red/70 hover:bg-gray-900/50"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isLoading}
      />
      <div className="text-center">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-xl md:text-2xl font-semibold text-white mb-2">
          {isLoading ? "Analyzing..." : "Drop your Bank/CSV Statement here"}
        </p>
        <p className="text-gray-500 text-sm">
          {isLoading ? "Please wait" : "or click to browse"}
        </p>
      </div>
    </div>
  );
}

function PrivacyNotice() {
  return (
    <div className="text-center mt-8 max-w-md mx-auto">
      <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
        <span className="text-green-500">🔒</span>
        We don&apos;t store your data. Everything is processed locally in your browser.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full py-6 text-center border-t border-gray-800">
      <p className="text-gray-500 text-sm">
        support: <a href="mailto:457239850@qq.com" className="text-warning-red hover:underline">457239850@qq.com</a>
      </p>
    </footer>
  );
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileDrop = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await parseAndAnalyzeCSV(file);
      setAnalysisResult(result);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Error parsing CSV file. Please make sure it is a valid bank statement.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            SaaS<span className="text-warning-red">Killer</span>.ai
          </h1>
          <p className="text-gray-400 text-center mt-2 text-lg">
            Find and kill your zombie subscriptions
          </p>
        </div>

        <WastedCounter />

        <DropZone onFileDrop={handleFileDrop} isLoading={isLoading} />

        <PrivacyNotice />
      </div>

      <ResultsPanel ref={resultsRef} result={analysisResult} isLoading={isLoading} />

      <Footer />
    </div>
  );
}
