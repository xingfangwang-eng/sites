import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { csrfProtection } from '@/lib/csrf';
import { rateLimit } from '@/lib/rateLimit';
import { isUserPaid } from '@/lib/subscriptionService';
import { logApiRequest, error } from '@/lib/logger';

interface SendPingRequest {
  to: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  let userId: string | null | undefined;

  try {
    // Check rate limit
    const rateLimitError = await rateLimit(request);
    if (rateLimitError) {
      logApiRequest(method, path, undefined, 429, 'Rate limit exceeded');
      return rateLimitError;
    }

    // Check CSRF protection
    const csrfError = csrfProtection(request);
    if (csrfError) {
      logApiRequest(method, path, undefined, 403, 'CSRF protection failed');
      return csrfError;
    }

    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken || !session.user?.email) {
      logApiRequest(method, path, undefined, 401, 'Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user.email;

    // Check if user is a paid subscriber
    if (!isUserPaid(userId)) {
      logApiRequest(method, path, userId, 403, 'Subscription required');
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
    }

    const { to, subject, message } = await request.json() as SendPingRequest;

    // Create email message for Gmail API
    const emailContent = createEmailContent(to, subject, message);
    
    // Send email using Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: emailContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to send email: ${errorData.message || 'Unknown error'}`;
      throw new Error(errorMessage);
    }

    logApiRequest(method, path, userId, 200);
    return NextResponse.json({ success: true });
  } catch (err) {
    error('Error sending ping:', { error: err, userId, path, method });
    logApiRequest(method, path, userId, 500, 'Failed to send ping');
    return NextResponse.json({ error: 'Failed to send ping' }, { status: 500 });
  }
}

function createEmailContent(to: string, subject: string, message: string): string {
  const email = `From: me\nTo: ${to}\nSubject: ${subject}\n\n${message}`;
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
