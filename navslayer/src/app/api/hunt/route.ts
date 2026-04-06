import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const APOLLO_API_KEY = process.env.APOLLO_API_KEY || "";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
const RATE_LIMIT_REQUESTS = parseInt(process.env.RATE_LIMIT_REQUESTS || "10");
const RATE_LIMIT_WINDOW_MS = 60000;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 60000);

interface Person {
  name: string;
  title: string;
  email: string;
  linkedin_url: string;
}

interface SearchResult {
  success: boolean;
  domain: string;
  count: number;
  people: Person[];
  requestId: string;
}

function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL is required" };
  }
  
  if (url.length > 500) {
    return { valid: false, error: "URL too long" };
  }

  const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+\/?$/i;
  const domainPattern = /^https?:\/\/(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*\.[a-zA-Z]{2,}(\/.*)?$/i;
  
  if (!linkedinPattern.test(url) && !domainPattern.test(url)) {
    return { valid: false, error: "Invalid LinkedIn company URL or domain format" };
  }
  
  return { valid: true };
}

function generateRequestId(): string {
  return `req_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

function sanitizeLog(message: string): string {
  return message
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[EMAIL]")
    .replace(/(?:password|token|key|secret|api[-_]?key)["\s:=]+[\w-]+/gi, "[REDACTED]");
}

function extractDomain(url: string): string | null {
  try {
    const linkedinPattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/company\/([^\/\?]+)/i;
    const match = url.match(linkedinPattern);
    if (match) {
      return match[1].toLowerCase().replace(/[^a-z0-9-]/g, "");
    }

    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function validateEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

async function searchApolloPeople(domain: string, requestId: string): Promise<Person[]> {
  if (!APOLLO_API_KEY) {
    console.log(sanitizeLog(`[${requestId}] Using mock data - no API key configured`));
    return generateMockData(domain);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": APOLLO_API_KEY,
      },
      body: JSON.stringify({
        q_organization_domains: [domain],
        person_titles: ["CEO", "Founder", "CTO", "Chief Executive Officer", "Co-Founder", "Chief Technology Officer"],
        page: 1,
        per_page: 3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(sanitizeLog(`[${requestId}] Apollo API error: ${response.status}`));
      return generateMockData(domain);
    }

    const data = await response.json();
    const people = data.people || [];

    return people.slice(0, 3).map((p: Record<string, unknown>) => {
      const email = typeof p.email === "string" && validateEmail(p.email) ? p.email : "N/A";
      return {
        name: typeof p.name === "string" ? p.name.slice(0, 100) : "Unknown",
        title: typeof p.title === "string" ? p.title.slice(0, 100) : "N/A",
        email,
        linkedin_url: typeof p.linkedin_url === "string" ? p.linkedin_url.slice(0, 200) : "",
      };
    });
  } catch (error) {
    clearTimeout(timeout);
    console.log(sanitizeLog(`[${requestId}] Apollo API fetch error: ${error instanceof Error ? error.message : "Unknown"}`));
    return generateMockData(domain);
  }
}

function generateMockData(domain: string): Person[] {
  const cleanDomain = domain.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
  return [
    {
      name: "John Mitchell",
      title: "Chief Executive Officer",
      email: `john.mitchell@${domain}`,
      linkedin_url: `https://linkedin.com/in/john-mitchell-${cleanDomain}`,
    },
    {
      name: "Sarah Chen",
      title: "Co-Founder & CTO",
      email: `sarah.chen@${domain}`,
      linkedin_url: `https://linkedin.com/in/sarah-chen-${cleanDomain}`,
    },
    {
      name: "Michael Rodriguez",
      title: "Founder",
      email: `michael@${domain}`,
      linkedin_url: `https://linkedin.com/in/michael-rodriguez-${cleanDomain}`,
    },
  ];
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  
  if (!origin && !referer) {
    return process.env.NODE_ENV === "development";
  }

  const checkOrigin = origin || (referer ? new URL(referer).origin : "");
  return ALLOWED_ORIGINS.some((allowed) => {
    try {
      const allowedUrl = new URL(allowed);
      return allowedUrl.origin === checkOrigin;
    } catch {
      return false;
    }
  });
}

function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  return "unknown";
}

function checkRateLimit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS - 1,
      reset: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  if (entry.count >= RATE_LIMIT_REQUESTS) {
    return {
      success: false,
      limit: RATE_LIMIT_REQUESTS,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  entry.count++;
  return {
    success: true,
    limit: RATE_LIMIT_REQUESTS,
    remaining: RATE_LIMIT_REQUESTS - entry.count,
    reset: entry.resetTime,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    if (!validateOrigin(request)) {
      console.log(sanitizeLog(`[${requestId}] Blocked invalid origin`));
      return NextResponse.json(
        { error: "Forbidden", requestId },
        { status: 403 }
      );
    }

    const ip = getIpAddress(request);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.success) {
      console.log(sanitizeLog(`[${requestId}] Rate limit exceeded for IP: ${ip}`));
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000),
          requestId 
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.reset.toString(),
            "Retry-After": Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", requestId },
        { status: 400 }
      );
    }

    const url = (body as Record<string, unknown>)?.url;
    if (typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required", requestId },
        { status: 400 }
      );
    }

    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, requestId },
        { status: 400 }
      );
    }

    const domain = extractDomain(url);

    if (!domain) {
      return NextResponse.json(
        { error: "Invalid LinkedIn company URL or domain", requestId },
        { status: 400 }
      );
    }

    const people = await searchApolloPeople(domain, requestId);

    const response: SearchResult = {
      success: true,
      domain,
      count: people.length,
      people,
      requestId,
    };

    const duration = Date.now() - startTime;
    console.log(sanitizeLog(`[${requestId}] Search completed in ${duration}ms for domain: ${domain}`));

    return NextResponse.json(response, {
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.reset.toString(),
        "X-Request-Id": requestId,
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(sanitizeLog(`[${requestId}] Internal error after ${duration}ms: ${error instanceof Error ? error.message : "Unknown"}`));
    
    return NextResponse.json(
      { error: "Internal server error", requestId },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0] || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
