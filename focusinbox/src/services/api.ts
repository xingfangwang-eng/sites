// API Service File
// Reserved interface functions for X API and LinkedIn API

// Mock data
const twitterMentions = [
  {
    id: '1',
    username: 'John Doe',
    handle: '@johndoe',
    content: 'Hey @focusinbox, I love your product!',
    timestamp: '2h ago',
    isUnread: true
  },
  {
    id: '2',
    username: 'Jane Smith',
    handle: '@janesmith',
    content: 'How do I connect my Twitter account to FocusInbox?',
    timestamp: '4h ago',
    isUnread: true
  },
  {
    id: '3',
    username: 'Mike Johnson',
    handle: '@mikejohnson',
    content: 'Great tool! Can you add support for more platforms?',
    timestamp: '1d ago',
    isUnread: false
  },
  {
    id: '4',
    username: 'Sarah Lee',
    handle: '@sarahlee',
    content: 'FocusInbox has changed how I manage my messages. Thanks!',
    timestamp: '2d ago',
    isUnread: false
  },
  {
    id: '5',
    username: 'David Kim',
    handle: '@davidkim',
    content: 'Is there a mobile app for FocusInbox?',
    timestamp: '3d ago',
    isUnread: false
  }
];

const linkedinMessages = [
  {
    id: '1',
    username: 'Alex Brown',
    content: 'Hello, I saw your profile and wanted to connect.',
    timestamp: '1h ago',
    isUnread: true
  },
  {
    id: '2',
    username: 'Emma Wilson',
    content: 'Thanks for connecting! I\'m interested in your work.',
    timestamp: '3h ago',
    isUnread: true
  },
  {
    id: '3',
    username: 'Robert Taylor',
    content: 'Hi, I saw you attended the same conference last week.',
    timestamp: '1d ago',
    isUnread: false
  },
  {
    id: '4',
    username: 'Lisa Martinez',
    content: 'I\'m reaching out regarding the job opportunity you posted.',
    timestamp: '2d ago',
    isUnread: false
  },
  {
    id: '5',
    username: 'James Anderson',
    content: 'Thanks for the recommendation!',
    timestamp: '3d ago',
    isUnread: false
  }
];

// X (Twitter) API interface
export const fetchTwitterMentions = async () => {
  try {
    // In actual project, we would call the twitter-api-v2 library here
    // Returning mock data for now
    return twitterMentions;
  } catch (error) {
    console.error('Error fetching Twitter mentions:', error);
    return [];
  }
};

// LinkedIn API interface
export const fetchLinkedInMessages = async () => {
  try {
    // In actual project, we would call the LinkedIn Marketing Developer Platform API here
    // Returning mock data for now
    return linkedinMessages;
  } catch (error) {
    console.error('Error fetching LinkedIn messages:', error);
    return [];
  }
};

// Send Twitter reply
export const sendTwitterReply = async (tweetId: string, message: string) => {
  try {
    // In actual project, we would call the twitter-api-v2 library to send reply
    console.log('Sending Twitter reply:', message, 'to tweet:', tweetId);
    return { success: true };
  } catch (error) {
    console.error('Error sending Twitter reply:', error);
    return { success: false };
  }
};

// Send LinkedIn reply
export const sendLinkedInReply = async (messageId: string, message: string) => {
  try {
    // In actual project, we would call the LinkedIn API to send reply
    console.log('Sending LinkedIn reply:', message, 'to message:', messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending LinkedIn reply:', error);
    return { success: false };
  }
};
