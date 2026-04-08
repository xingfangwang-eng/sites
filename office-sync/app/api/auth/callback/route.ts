import { NextRequest, NextResponse } from 'next/server';
import gmailService from '@/app/lib/gmailService';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const tokens = await gmailService.getToken(code);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error handling auth callback:', error);
    return NextResponse.json({ error: 'Failed to handle auth callback' }, { status: 500 });
  }
}
