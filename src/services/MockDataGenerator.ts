import {
  MessagingUser,
  Conversation,
  Message,
  ConversationType,
  UserType,
  MessageType,
  MessageStatus,
  PollOption
} from '@/types/messaging';

const ADJECTIVES = ['Elegant', 'Fast', 'Premium', 'Secure', 'Smart', 'Global', 'Direct', 'Cloud', 'Silent', 'Swift', 'Deep', 'Bright', 'Golden', 'Silver', 'Crystal', 'Urban'];
const NOUNS = ['Network', 'Space', 'Hub', 'Nexus', 'Point', 'Flow', 'Link', 'Wave', 'Core', 'Edge', 'Sphere', 'Orbit', 'Pulse', 'Node', 'Path', 'Bridge'];

const LOREM = [
  "Hello! How are you today? 😊",
  "Check out this amazing product! It's exactly what you were looking for.",
  "Are we still meeting at 5? I'll be a bit late.",
  "The new update is live now. Check the changelog!",
  "I've sent the documents to your email. Please review them.",
  "That sounds like a great plan! Let's do it. 🚀",
  "Can you review the latest designs? I think the colors need work.",
  "I'm on my way, be there in 10 mins. Traffic is crazy!",
  "Did you see the news about the merger?",
  "Happy Birthday! Have a fantastic day! 🎂",
  "Let me know when you're free to talk. I have something important.",
  "The meeting was postponed to tomorrow at 10 AM.",
  "Check out this GIF!",
  "I just shared my live location with you.",
  "Voice message attached."
];

export const generateMockUser = (id: string, type: UserType = 'personal'): MessagingUser => {
  const name = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;
  return {
    id,
    username: name.toLowerCase().replace(' ', '_'),
    displayName: name,
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    type,
    isOnline: Math.random() > 0.4,
    lastSeen: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    isVerified: Math.random() > 0.8 || type === 'business' || type === 'verified',
    isPremium: Math.random() > 0.7 || type === 'premium',
    isBot: type === 'bot',
    isBusiness: type === 'business',
    about: "Modern messaging for the future. Stay connected.",
  };
};

export const generateMockData = () => {
  const users: MessagingUser[] = [];
  const conversations: Conversation[] = [];
  const messages: Record<string, Message[]> = {};

  const currentUser: MessagingUser = {
    id: 'me',
    username: 'jules_architect',
    displayName: 'Jules Architect',
    avatar: 'https://i.pravatar.cc/150?u=me',
    type: 'premium',
    isOnline: true,
    isPremium: true,
    about: "Principal Architect of this Messaging System.",
  };

  // Generate 120 Conversations
  for (let i = 1; i <= 120; i++) {
    const id = i.toString();
    let type: ConversationType = 'personal';
    if (i % 12 === 0) type = 'bot';
    else if (i % 10 === 0) type = 'channel';
    else if (i % 8 === 0) type = 'group';
    else if (i % 6 === 0) type = 'business';

    const user = generateMockUser(id, type === 'personal' ? 'personal' : (type as any));
    users.push(user);

    const convId = `chat_${id}`;
    const conv: Conversation = {
      id: convId,
      type,
      participants: ['me', id],
      unreadCount: Math.random() > 0.8 ? Math.floor(Math.random() * 20) : 0,
      isPinned: i <= 5,
      isMuted: i > 115,
      isArchived: i > 110 && i <= 115,
      metadata: {
        name: type === 'group' || type === 'channel' ? `${type.charAt(0).toUpperCase() + type.slice(1)}: ${user.displayName}` : user.displayName,
        avatar: user.avatar,
        memberCount: type === 'group' || type === 'channel' ? Math.floor(Math.random() * 50000) : undefined,
      }
    };
    conversations.push(conv);

    const chatMessages: Message[] = [];
    const msgCount = Math.floor(Math.random() * 40) + 15;

    for (let j = 1; j <= msgCount; j++) {
      const isMe = Math.random() > 0.5;
      const msgType: MessageType =
        j % 15 === 0 ? 'image' :
        j % 20 === 0 ? 'video' :
        j % 22 === 0 ? 'voice' :
        j % 28 === 0 ? 'poll' :
        j % 35 === 0 ? 'system' :
        j % 40 === 0 ? 'file' : 'text';

      let content = LOREM[Math.floor(Math.random() * LOREM.length)];
      let metadata: any = {};

      if (msgType === 'image') {
        content = 'Image Message';
        metadata = { uri: `https://picsum.photos/seed/${convId}_${j}/600/800`, width: 600, height: 800 };
      } else if (msgType === 'poll') {
        content = 'Poll: Which feature is best?';
        metadata = {
          question: content,
          options: [
            { id: '1', text: 'Real-time sync', votes: 125, voters: [] },
            { id: '2', text: 'Premium UI', votes: 450, voters: [] },
            { id: '3', text: 'Voice Messages', votes: 89, voters: [] },
          ]
        };
      } else if (msgType === 'voice') {
        content = 'Voice Message';
        metadata = { duration: 45, waveform: Array.from({length: 30}, () => Math.random()) };
      } else if (msgType === 'system') {
        content = 'Messages to this chat are now secured with end-to-end encryption.';
      } else if (msgType === 'file') {
        content = 'Project_Specs.pdf';
        metadata = { size: 2400000, extension: 'pdf' };
      }

      chatMessages.push({
        id: `m_${id}_${j}`,
        chatId: convId,
        senderId: isMe ? 'me' : id,
        type: msgType,
        content,
        timestamp: new Date(Date.now() - (msgCount - j) * 3600000).toISOString(),
        status: 'read',
        metadata,
      });
    }
    messages[convId] = chatMessages;
    conv.lastMessageId = chatMessages[chatMessages.length - 1].id;
  }

  // Saved Messages
  const savedId = 'chat_saved';
  conversations.unshift({
    id: savedId,
    type: 'personal',
    participants: ['me'],
    unreadCount: 0,
    isPinned: true,
    metadata: {
      name: 'Saved Messages',
    }
  });
  messages[savedId] = [
    {
      id: 'm_saved_1',
      chatId: savedId,
      senderId: 'me',
      type: 'text',
      content: 'Welcome to your cloud storage! You can forward messages here to keep them handy.',
      timestamp: new Date().toISOString(),
      status: 'sent',
    }
  ];

  return { currentUser, conversations, messages };
};
