import { NextResponse } from 'next/server';
import gmailService from '@/app/lib/gmailService';

export async function GET() {
  try {
    const authUrl = gmailService.getAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    return NextResponse.json({ error: 'Failed to get auth URL' }, { status: 500 });
  }
}
