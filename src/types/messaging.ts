export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'uploading' | 'downloading';

export type UserType = 'personal' | 'bot' | 'business' | 'verified' | 'premium';

export interface MessagingUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  type: UserType;
  isOnline: boolean;
  lastSeen?: string; // ISO string
  about?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  isBot?: boolean;
  isBusiness?: boolean;
}

export type MessageType =
  | 'text' | 'image' | 'video' | 'voice' | 'audio' | 'file'
  | 'location' | 'gif' | 'sticker' | 'poll' | 'contact'
  | 'product' | 'system' | 'call';

export interface MessageReaction {
  emoji: string;
  count: number;
  me: boolean;
  userIds: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string; // For text, or JSON string for complex types
  timestamp: string;
  status: MessageStatus;
  replyToId?: string;
  forwardedFromId?: string;
  isEdited?: boolean;
  isPinned?: boolean;
  reactions?: MessageReaction[];
  metadata?: any; // For sizes, resolutions, etc.
}

export type ConversationType = 'personal' | 'group' | 'channel' | 'bot' | 'business';

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  lastMessageId?: string;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  draft?: string;
  wallpaper?: string;
  typingUsers?: string[];
  metadata?: {
    name?: string;
    avatar?: string;
    description?: string;
    memberCount?: number;
    ownerId?: string;
    adminIds?: string[];
  };
}

export interface CallLog {
  id: string;
  userId: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: number;
}
