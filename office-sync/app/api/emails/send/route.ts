import { NextRequest, NextResponse } from 'next/server';
import gmailService from '@/app/lib/gmailService';

export async function POST(request: NextRequest) {
  try {
    const { credentials, to, subject, body } = await request.json();
    if (!credentials || !to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 设置 Gmail 凭证
    gmailService.setCredentials(credentials);

    // 发送邮件
    await gmailService.sendEmail(to, subject, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
