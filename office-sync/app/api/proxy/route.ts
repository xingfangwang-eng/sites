import { NextRequest, NextResponse } from 'next/server';
import http from 'http';
import https from 'https';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const response = await fetchUrl(url);
    
    // 创建新的响应，移除 X-Frame-Options 头
    const headers = new Headers(response.headers);
    headers.delete('X-Frame-Options');
    headers.delete('Content-Security-Policy');
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const body = await request.text();
    const response = await fetchUrl(url, {
      method: 'POST',
      body,
      headers: request.headers
    });
    
    // 创建新的响应，移除 X-Frame-Options 头
    const headers = new Headers(response.headers);
    headers.delete('X-Frame-Options');
    headers.delete('Content-Security-Policy');
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

function fetchUrl(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    redirect: 'follow'
  });
}
