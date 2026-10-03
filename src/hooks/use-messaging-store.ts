import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import {
  MessagingUser,
  Message,
  Conversation,
  CallLog
} from '@/types/messaging';

interface MessagingState {
  currentUser: MessagingUser | null;
  conversations: Record<string, Conversation>;
  messages: Record<string, Message[]>; // chatId -> messages
  activeCalls: CallLog[];
  callHistory: CallLog[];

  // UI States
  selectionMode: {
    active: boolean;
    selectedMessageIds: string[];
    chatId: string | null;
  };

  // Upload/Download Tracking
  transfers: Record<string, { progress: number; status: 'uploading' | 'downloading' | 'completed' | 'failed' }>;

  // Actions
  setCurrentUser: (user: MessagingUser) => void;
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (chatId: string, updates: Partial<Conversation>) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (chatId: string, messageId: string) => void;

  // Selection Actions
  toggleMessageSelection: (chatId: string, messageId: string) => void;
  clearSelection: () => void;

  // Draft Actions
  setDraft: (chatId: string, draft: string) => void;

  // Transfer Actions
  updateTransfer: (id: string, progress: number, status: 'uploading' | 'downloading' | 'completed' | 'failed') => void;

  // Persistence Reset
  resetMessaging: () => void;
}

export const useMessagingStore = create<MessagingState>()(
  persist(
    (set) => ({
      currentUser: null,
      conversations: {},
      messages: {},
      activeCalls: [],
      callHistory: [],
      transfers: {},

      selectionMode: {
        active: false,
        selectedMessageIds: [],
        chatId: null,
      },

      setCurrentUser: (user) => set({ currentUser: user }),

      setConversations: (conversations) => {
        const convMap: Record<string, Conversation> = {};
        conversations.forEach(c => convMap[c.id] = c);
        set({ conversations: convMap });
      },

      updateConversation: (chatId, updates) => set((state) => ({
        conversations: {
          ...state.conversations,
          [chatId]: { ...state.conversations[chatId], ...updates }
        }
      })),

      addMessage: (chatId, message) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: [...chatMessages, message]
          }
        };
      }),

      updateMessage: (chatId, messageId, updates) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.map(m => m.id === messageId ? { ...m, ...updates } : m)
          }
        };
      }),

      deleteMessage: (chatId, messageId) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.filter(m => m.id !== messageId)
          }
        };
      }),

      toggleMessageSelection: (chatId, messageId) => set((state) => {
        const isSelected = state.selectionMode.selectedMessageIds.includes(messageId);
        const newSelected = isSelected
          ? state.selectionMode.selectedMessageIds.filter(id => id !== messageId)
          : [...state.selectionMode.selectedMessageIds, messageId];

        return {
          selectionMode: {
            active: newSelected.length > 0,
            selectedMessageIds: newSelected,
            chatId: newSelected.length > 0 ? chatId : null,
          }
        };
      }),

      clearSelection: () => set({
        selectionMode: { active: false, selectedMessageIds: [], chatId: null }
      }),

      setDraft: (chatId, draft) => set((state) => ({
        conversations: {
          ...state.conversations,
          [chatId]: { ...state.conversations[chatId], draft }
        }
      })),

      updateTransfer: (id, progress, status) => set((state) => ({
        transfers: {
          ...state.transfers,
          [id]: { progress, status }
        }
      })),

      resetMessaging: () => set({
        conversations: {},
        messages: {},
        activeCalls: [],
        callHistory: [],
        transfers: {},
        selectionMode: { active: false, selectedMessageIds: [], chatId: null }
      }),
    }),
    {
      name: 'cardiani-messaging-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        conversations: state.conversations,
        messages: state.messages,
        callHistory: state.callHistory,
      }),
    }
  )
);
