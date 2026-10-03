import {
  MessagingUser,
  Message,
  Conversation,
  ConversationType,
  MessageType,
  MessageStatus,
  PollOption
} from '@/types/messaging';
import { useMessagingStore } from '@/hooks/use-messaging-store';
import { realtimeService } from './realtime/RealtimeService';

export default class MessagingService {
  private static instance: MessagingService;
  private typingTimeouts: Record<string, NodeJS.Timeout> = {};

  private constructor() {
    this.setupRealtimeListeners();
  }

  private setupRealtimeListeners() {
    // 1. Listen for new real-time messages
    realtimeService.subscribe('message.created', (payload: any) => {
      const store = useMessagingStore.getState();
      const newMessage: Message = {
        id: payload.message_id,
        chatId: payload.conversation_id,
        senderId: payload.sender_id,
        type: 'text',
        content: payload.content,
        timestamp: payload.created_at,
        status: 'read',
      };
      store.addMessage(payload.conversation_id, newMessage);
      store.updateConversation(payload.conversation_id, {
        lastMessageId: newMessage.id,
        unreadCount: (store.conversations[payload.conversation_id]?.unreadCount || 0) + 1
      });
    });

    // 2. Listen for real-time presence changes
    realtimeService.subscribe('presence.changed', (payload: any) => {
      const store = useMessagingStore.getState();
      // Update presence status dynamically
      this.simulatePresence(payload.target_user_id, payload.status === 'online');
    });

    // 3. Listen for typing events
    realtimeService.subscribe('chat.typing.started', (payload: any) => {
      this.simulateTyping(payload.conversation_id, payload.user_id);
    });
  }

  static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  // Simulation Helpers
  simulateIncomingMessage(chatId: string, sender: MessagingUser, text: string, type: MessageType = 'text', metadata: any = {}) {
    const store = useMessagingStore.getState();
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      chatId,
      senderId: sender.id,
      type,
      content: text,
      timestamp: new Date().toISOString(),
      status: 'delivered',
      metadata,
    };

    store.addMessage(chatId, newMessage);
    store.updateConversation(chatId, {
      lastMessageId: newMessage.id,
      unreadCount: (store.conversations[chatId]?.unreadCount || 0) + 1
    });

    // Simulate "Read" after a few seconds
    setTimeout(() => {
      useMessagingStore.getState().updateMessage(chatId, newMessage.id, { status: 'read' });
    }, 3000);
  }

  simulateTyping(chatId: string, userId: string, isRecording: boolean = false) {
    const store = useMessagingStore.getState();
    const conv = store.conversations[chatId];
    if (!conv) return;

    const currentTyping = conv.typingUsers || [];
    if (!currentTyping.includes(userId)) {
      store.updateConversation(chatId, {
        typingUsers: [...currentTyping, userId]
      });
    }

    if (this.typingTimeouts[chatId + userId]) {
      clearTimeout(this.typingTimeouts[chatId + userId]);
    }

    this.typingTimeouts[chatId + userId] = setTimeout(() => {
      const updatedConv = useMessagingStore.getState().conversations[chatId];
      if (updatedConv) {
        store.updateConversation(chatId, {
          typingUsers: (updatedConv.typingUsers || []).filter(id => id !== userId)
        });
      }
    }, 3000);
  }

  simulatePresence(userId: string, isOnline: boolean) {
    const store = useMessagingStore.getState();
    // In a real app, we'd find all conversations with this user
    Object.values(store.conversations).forEach(conv => {
      if (conv.participants.includes(userId)) {
        // This is a bit simplified, usually we'd have a separate users store
      }
    });
  }

  simulateMemberEvent(chatId: string, userId: string, event: 'joined' | 'left') {
    const store = useMessagingStore.getState();
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      chatId,
      senderId: 'system',
      type: 'system',
      content: `User ${userId} ${event} the group.`,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    store.addMessage(chatId, newMessage);
  }

  async sendMessage(chatId: string, text: string, type: MessageType = 'text', metadata: any = {}) {
    const store = useMessagingStore.getState();
    const currentUser = store.currentUser;
    if (!currentUser) return;

    // Send via platform-level real-time websocket layer if active
    try {
      realtimeService.send('message.send', {
        conversation_id: chatId,
        content: text,
      });
    } catch (err) {
      console.warn('[MessagingService] WS send failed, falling back to local simulation:', err);
    }

    const messageId = Math.random().toString(36).substr(2, 9);
    const newMessage: Message = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      type,
      content: text,
      timestamp: new Date().toISOString(),
      status: (type === 'image' || type === 'video' || type === 'file' || type === 'voice') ? 'uploading' : 'sending',
      metadata,
    };

    store.addMessage(chatId, newMessage);
    store.setDraft(chatId, '');

    // Simulate Network Latency & Progress
    if (newMessage.status === 'uploading') {
      let progress = 0;
      const transferId = messageId;
      store.updateTransfer(transferId, 0, 'uploading');

      const interval = setInterval(() => {
        progress += 20;
        store.updateTransfer(transferId, progress, 'uploading');

        if (progress >= 100) {
          clearInterval(interval);
          store.updateTransfer(transferId, 100, 'completed');
          store.updateMessage(chatId, messageId, { status: 'sent' });
          this.proceedToReadStatus(chatId, messageId);
        }
      }, 400);
    } else {
      setTimeout(() => {
        store.updateMessage(chatId, messageId, { status: 'sent' });
        this.proceedToReadStatus(chatId, messageId);
      }, 500);
    }
  }

  private proceedToReadStatus(chatId: string, messageId: string) {
    const store = useMessagingStore.getState();
    setTimeout(() => {
      store.updateMessage(chatId, messageId, { status: 'delivered' });
      setTimeout(() => {
        store.updateMessage(chatId, messageId, { status: 'read' });
      }, 2000);
    }, 1000);
  }
}

export const messagingService = MessagingService.getInstance();
