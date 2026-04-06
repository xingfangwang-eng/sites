"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Person {
  name: string;
  title: string;
  email: string;
  linkedin_url: string;
}

interface TerminalLine {
  type: "info" | "success" | "error" | "data";
  text: string;
}

interface ApiError {
  error: string;
  requestId?: string;
  retryAfter?: number;
}

const MAX_URL_LENGTH = 500;
const RATE_LIMIT_DELAY = 1000;

function maskEmail(email: string): string {
  if (!email || email === "N/A") return "N/A";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  const visibleChars = Math.min(3, localPart.length);
  const maskedPart = localPart.slice(0, visibleChars) + "****";
  return `${maskedPart}@${domain}`;
}

function sanitizeUrl(url: string): string {
  return url.trim().slice(0, MAX_URL_LENGTH);
}

function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: false, error: "Please enter a LinkedIn company URL" };
  }
  
  const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+\/?$/i;
  const domainPattern = /^https?:\/\/(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*\.[a-zA-Z]{2,}(\/.*)?$/i;
  
  if (!linkedinPattern.test(url) && !domainPattern.test(url)) {
    return { valid: false, error: "Please enter a valid LinkedIn company URL or domain" };
  }
  
  return { valid: true };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [domain, setDomain] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lastRequestTime = useRef(0);

  useEffect(() => {
    if (terminalLines.length > 0 && displayedLines.length < terminalLines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, terminalLines[prev.length]]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [terminalLines, displayedLines]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines]);

  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setRateLimited(false);
    }
  }, [retryCountdown]);

  const handleSubmit = useCallback(async () => {
    if (isLoading || rateLimited) return;

    const sanitizedUrl = sanitizeUrl(url);
    const validation = validateUrl(sanitizedUrl);
    
    if (!validation.valid) {
      setError(validation.error || "Invalid URL");
      return;
    }

    const now = Date.now();
    if (now - lastRequestTime.current < RATE_LIMIT_DELAY) {
      setError("Please wait a moment before trying again");
      return;
    }
    lastRequestTime.current = now;

    setIsLoading(true);
    setError(null);
    setTerminalLines([]);
    setDisplayedLines([]);
    setPeople([]);
    setDomain("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sanitizedUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await response.json();
      const lines: TerminalLine[] = [];

      if (response.status === 429) {
        const apiError = data as ApiError;
        setRateLimited(true);
        setRetryCountdown(apiError.retryAfter || 60);
        lines.push({ type: "error", text: `Rate limited. Please wait ${apiError.retryAfter || 60} seconds.` });
        setTerminalLines(lines);
        return;
      }

      if (!response.ok) {
        const apiError = data as ApiError;
        lines.push({ type: "error", text: apiError.error || "An error occurred" });
        setTerminalLines(lines);
        if (apiError.requestId) {
          console.error(`Request ID: ${apiError.requestId}`);
        }
        return;
      }

      if (data.success) {
        lines.push({ type: "info", text: `Targeting domain: ${data.domain}` });
        lines.push({ type: "info", text: "Scanning decision makers..." });
        lines.push({ type: "success", text: `${data.count} decision makers identified` });
        setTerminalLines(lines);
        setPeople(data.people);
        setDomain(data.domain);
      } else {
        lines.push({ type: "error", text: data.error || "Unknown error" });
        setTerminalLines(lines);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setTerminalLines([{ type: "error", text: "Request timed out. Please try again." }]);
      } else {
        setTerminalLines([{ type: "error", text: "Connection failed. Please check your network." }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, isLoading, rateLimited]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const getLineColor = useCallback((type: TerminalLine["type"]) => {
    switch (type) {
      case "info":
        return "text-slate-500";
      case "success":
        return "text-emerald-600";
      case "error":
        return "text-red-500";
      default:
        return "text-slate-600";
    }
  }, []);

  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">NavSlayer</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">Pricing</a>
            <a href="mailto:457239850@qq.com" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Support</a>
          </nav>
        </header>

        <main className="space-y-8">
          <section className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              AI-Powered Lead Generation
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Find Decision Makers
              <span className="block gradient-text">For $0.50 Each</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Stop paying $99/month for Sales Navigator. Get direct access to CEO, Founder, and CTO emails instantly.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 card-shadow p-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                LinkedIn Company URL
              </label>
              <textarea
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="https://linkedin.com/company/example"
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                spellCheck={false}
                disabled={isLoading || rateLimited}
                maxLength={MAX_URL_LENGTH}
              />
              
              {error && (
                <div className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {rateLimited && (
                <div className="mt-2 text-sm text-orange-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Rate limited. Please wait {retryCountdown} seconds.
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !url.trim() || rateLimited}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-lg py-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </span>
                ) : rateLimited ? (
                  `Wait ${retryCountdown}s`
                ) : (
                  "Find Decision Makers"
                )}
              </button>

              {(displayedLines.length > 0 || isLoading) && (
                <div
                  ref={terminalRef}
                  className="mt-4 bg-slate-900 rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm"
                >
                  {displayedLines.map((line, index) => (
                    <div key={index} className={`${getLineColor(line.type)} mb-1`}>
                      <span className="text-slate-500 mr-2">&gt;</span>
                      {line.text}
                    </div>
                  ))}
                  {isLoading && displayedLines.length === terminalLines.length && (
                    <div className="text-slate-400 animate-pulse">_</div>
                  )}
                </div>
              )}
            </div>

            <div id="pricing" className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-1">$0.50</div>
                <div className="text-indigo-100 text-sm">per verified email</div>
                <div className="mt-4 pt-4 border-t border-white/20 text-sm text-indigo-100">
                  vs $99/month for Sales Navigator
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="font-medium text-slate-900">Verified Emails</div>
                </div>
                <p className="text-sm text-slate-500">Direct contact info for key decision makers</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="font-medium text-slate-900">Instant Results</div>
                </div>
                <p className="text-sm text-slate-500">Get results in seconds, not hours</p>
              </div>
            </div>
          </div>

          {people.length > 0 && displayedLines.length === terminalLines.length && (
            <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Decision Makers Found</h2>
                    <p className="text-sm text-slate-500 mt-1">Target: {domain}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
                    {people.length} results
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {people.map((person, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{person.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-500">{person.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">
                              {maskEmail(person.email)}
                            </code>
                            <button
                              onClick={() => setShowPaywall(true)}
                              className="px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              Unlock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <p className="text-center text-sm text-slate-500">
                  Tired of over-engineered B2B tools? NavSlayer is the minimalist choice for smart sales teams.
                </p>
              </div>
            </div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6 card-shadow-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Smart Search</h3>
              <p className="text-sm text-slate-500">AI-powered search finds the right decision makers automatically</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6 card-shadow-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Verified Data</h3>
              <p className="text-sm text-slate-500">All emails are verified and ready for outreach</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6 card-shadow-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Pay Per Use</h3>
              <p className="text-sm text-slate-500">No subscriptions. Only pay for what you need.</p>
            </div>
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © 2024 NavSlayer. B2B Lead Generation made simple.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
              <span>Cheap LinkedIn Sales Navigator alternative</span>
              <span>•</span>
              <span>B2B lead gen tool for startups</span>
              <span>•</span>
              <span>Find CEO email address</span>
              <span>•</span>
              <span>Affordable lead scraping service</span>
            </div>
          </div>
        </footer>
      </div>

      {showPaywall && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full card-shadow animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Get All 3 Emails</h3>
              <div className="text-4xl font-bold gradient-text">$0.50</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <ol className="text-sm text-slate-600 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium shrink-0">1</span>
                  <span>Click the PayPal button below</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium shrink-0">2</span>
                  <span>Send $0.50 to the PayPal account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium shrink-0">3</span>
                  <span>Add your target domain as note: <code className="bg-white px-2 py-0.5 rounded text-indigo-600">{domain}</code></span>
                </li>
              </ol>
            </div>

            <a
              href="https://www.paypal.com/paypalme/xingfangwang"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold text-lg py-4 rounded-xl text-center transition-all"
            >
              Pay with PayPal
            </a>

            <p className="text-center text-xs text-slate-400 mt-4">
              PayPal: xingfang.wang@gmail.com
            </p>

            <button
              onClick={() => setShowPaywall(false)}
              className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
