import { NextRequest, NextResponse } from 'next/server';
import gmailService from '@/app/lib/gmailService';
import openaiService from '@/app/lib/openaiService';

export async function POST(request: NextRequest) {
  try {
    const { credentials } = await request.json();
    if (!credentials) {
      return NextResponse.json({ error: 'No credentials provided' }, { status: 400 });
    }

    // 设置 Gmail 凭证
    gmailService.setCredentials(credentials);

    // 获取邮件列表
    const emails = await gmailService.getEmails(10);

    // 对每个邮件进行分类
    const classifiedEmails = await Promise.all(
      emails.map(async (email) => {
        try {
          // 获取邮件详情
          const detail = await gmailService.getEmailDetail(email.id!);
          // 分类邮件
          const classification = await openaiService.classifyEmail({
            subject: detail.subject,
            from: detail.from,
            body: detail.body,
          });
          // 生成敷衍回复
          const reply = await openaiService.generateReply({
            subject: detail.subject,
            from: detail.from,
            body: detail.body,
          });

          return {
            ...email,
            classification,
            reply,
          };
        } catch (error) {
          console.error('Error processing email:', error);
          return {
            ...email,
            classification: '稍后处理',
            reply: 'Looking into this, will update you later today.',
          };
        }
      })
    );

    return NextResponse.json({ emails: classifiedEmails });
  } catch (error) {
    console.error('Error getting emails:', error);
    return NextResponse.json({ error: 'Failed to get emails' }, { status: 500 });
  }
}
