import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { csrfProtection } from '@/lib/csrf';
import { rateLimit } from '@/lib/rateLimit';
import { logApiRequest, error } from '@/lib/logger';

interface Email {
  id: string;
  threadId: string;
  subject: string;
  to: string;
  date: string;
  from: string;
}

interface GhostedEmail {
  name: string;
  email: string;
  lastContactDate: string;
  subjectPreview: string;
  originalSubject: string;
}

export async function GET(request: NextRequest) {
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
    
    if (!session || !session.accessToken) {
      logApiRequest(method, path, undefined, 401, 'Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.email;

    // Get sent emails from Gmail API
    const sentEmails = await fetchSentEmails(session.accessToken as string);
    
    // Filter ghosted emails
    const ghostedEmails = await filterGhostedEmails(sentEmails, session.accessToken as string);
    
    // Sanitize response data to prevent sensitive information leakage
    const sanitizedEmails = ghostedEmails.map(email => ({
      name: email.name,
      email: email.email,
      lastContactDate: email.lastContactDate,
      subjectPreview: email.subjectPreview,
      // Do not include originalSubject to prevent sensitive information leakage
    }));
    
    logApiRequest(method, path, userId, 200);
    return NextResponse.json(sanitizedEmails);
  } catch (err) {
    error('Error scanning emails:', { error: err, userId, path, method });
    logApiRequest(method, path, userId, 500, 'Failed to scan emails');
    return NextResponse.json({ error: 'Failed to scan emails' }, { status: 500 });
  }
}

async function fetchSentEmails(accessToken: string): Promise<Email[]> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=SENT&maxResults=50&format=metadata&metadataHeaders=Subject,To,From,Date', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sent emails');
  }

  const data = await response.json();
  const messages = data.messages || [];

  const emails: Email[] = [];
  
  for (const message of messages) {
    const headers = message.payload.headers || [];
    
    const subjectHeader = headers.find((h: any) => h.name === 'Subject');
    const toHeader = headers.find((h: any) => h.name === 'To');
    const fromHeader = headers.find((h: any) => h.name === 'From');
    const dateHeader = headers.find((h: any) => h.name === 'Date');

    emails.push({
      id: message.id,
      threadId: message.threadId,
      subject: subjectHeader?.value || '',
      to: toHeader?.value || '',
      from: fromHeader?.value || '',
      date: dateHeader?.value || '',
    });
  }

  return emails;
}

async function filterGhostedEmails(emails: Email[], accessToken: string): Promise<GhostedEmail[]> {
  const ghostedEmails: GhostedEmail[] = [];
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  // Filter emails that are more than 48 hours old first
  const oldEmails = emails.filter(email => {
    const emailDate = new Date(email.date);
    return emailDate < fortyEightHoursAgo;
  });

  // Process each old email with parallel requests
  const threadPromises = oldEmails.map(async (email) => {
    try {
      // Get the entire thread to check if there's a reply
      const threadResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${email.threadId}?format=metadata&metadataHeaders=From`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (threadResponse.ok) {
        const threadData = await threadResponse.json();
        const messages = threadData.messages || [];
        
        // Get the last message in the thread
        const lastMessage = messages[messages.length - 1];
        const lastMessageHeaders = lastMessage.payload.headers;
        const lastFromHeader = lastMessageHeaders.find((h: any) => h.name === 'From');
        
        // Check if the last message was sent by the user
        if (lastFromHeader?.value === email.from) {
          // Extract name and email from 'To' field
          const toField = email.to;
          let name = toField;
          let emailAddress = toField;
          
          const nameMatch = toField.match(/"([^"]+)"/);
          if (nameMatch) {
            name = nameMatch[1];
            const emailMatch = toField.match(/<([^>]+)>/);
            if (emailMatch) {
              emailAddress = emailMatch[1];
            }
          } else if (toField.includes('<')) {
            name = toField.split('<')[0].trim();
            emailAddress = toField.split('<')[1].split('>')[0].trim();
          }

          return {
            name,
            email: emailAddress,
            lastContactDate: email.date,
            subjectPreview: email.subject.substring(0, 50) + (email.subject.length > 50 ? '...' : ''),
            originalSubject: email.subject,
          };
        }
      }
    } catch (error) {
      console.error(`Error processing thread ${email.threadId}:`, error);
      // Continue processing other emails even if one fails
    }
    return null;
  });

  // Wait for all promises to resolve
  const results = await Promise.all(threadPromises);
  
  // Filter out null results and add to ghostedEmails
  results.forEach(result => {
    if (result) {
      ghostedEmails.push(result);
    }
  });

  return ghostedEmails;
}
