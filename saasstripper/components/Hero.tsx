"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CTAModal from "./CTAModal";

export default function Hero() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [endpointId, setEndpointId] = useState("");
  const [showCTA, setShowCTA] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStrip = async () => {
    setError("");
    setOutput(null);
    setShowOutput(false);
    setDeployedUrl("");
    setPaymentRequired(false);
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter valid JSON data");
      return;
    }

    try {
      JSON.parse(input);
    } catch {
      setError("Invalid JSON format");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/strip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jsonInput: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to process JSON");
        setLoading(false);
        return;
      }

      setOutput(data.result);
      setShowOutput(true);
    } catch {
      setError("Failed to process JSON");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!output) return;

    setDeployLoading(true);
    setError("");
    setPaymentRequired(false);

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonData: output,
          isAnonymous: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresPayment) {
          setPaymentRequired(true);
          setError(data.message);
        } else {
          setError(data.error || "Deploy failed");
        }
        setDeployLoading(false);
        return;
      }

      setDeployedUrl(data.endpointUrl);
      setEndpointId(data.shortId);
    } catch {
      setError("Deploy failed");
    } finally {
      setDeployLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(output, null, 2));
      setCopied(true);
      setShowCTA(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Copy failed");
    }
  };

  const paypalLink = `https://www.paypal.com/paypalme/xingfangwang/9USD`;

  return (
    <main className="w-full min-h-screen bg-grid bg-gradient-radial">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4">
            Strip Bloated APIs into
            <span className="text-indigo-500"> Clean Data</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Tired of expensive, bloated SaaS APIs? Transform complex API responses into clean, usable data in seconds.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 text-sm font-medium text-slate-500">Input JSON</span>
            </div>
          </div>
          <textarea
            className="w-full h-64 md:h-80 p-6 bg-white text-slate-700 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
            placeholder="Paste your API response here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Strip Button */}
        <button
          onClick={handleStrip}
          disabled={loading}
          className="w-full py-4 bg-indigo-500 text-white text-lg font-semibold rounded-lg hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            "Strip JSON"
          )}
        </button>

        {/* Output Section */}
        {showOutput && output && (
          <div className="mt-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-sm font-medium text-slate-700">Stripped Result</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <div className="p-6 overflow-x-auto bg-slate-900">
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                    fontSize: "13px",
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  }}
                >
                  {JSON.stringify(output, null, 2)}
                </SyntaxHighlighter>
              </div>

              {/* Deploy Section */}
              {!deployedUrl && !paymentRequired && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={handleDeploy}
                    disabled={deployLoading}
                    className="w-full py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {deployLoading ? "Deploying..." : "Deploy Endpoint"}
                  </button>
                </div>
              )}

              {/* Deployed URL */}
              {deployedUrl && (
                <div className="px-6 py-4 border-t border-slate-100 bg-green-50">
                  <p className="text-sm font-medium text-green-800 mb-2">Endpoint Live</p>
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 font-mono underline break-all"
                  >
                    {deployedUrl}
                  </a>
                  <p className="text-xs text-slate-500 mt-2">ID: {endpointId} · Expires in 24h</p>
                </div>
              )}

              {/* Payment Required */}
              {paymentRequired && (
                <div className="px-6 py-4 border-t border-slate-100 bg-amber-50">
                  <p className="text-sm font-medium text-amber-800 mb-2">Limit Reached</p>
                  <p className="text-sm text-amber-700 mb-4">
                    You have 1 strip left. Pay $9 to own this endpoint forever.
                  </p>
                  <a
                    href={paypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Pay $9 via PayPal
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <p className="text-xs text-amber-600 mt-2">Include your Endpoint ID in payment note</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CTAModal isOpen={showCTA} onClose={() => setShowCTA(false)} />
    </main>
  );
}
