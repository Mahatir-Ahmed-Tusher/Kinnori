import { useState, useEffect } from 'react';
import type { BotProfile, ChatMessage } from '@/types/schema';

// Local storage keys
const STORAGE_KEYS = {
  BOT_PROFILES: 'kinnori_bot_profiles',
  CHAT_MESSAGES: 'kinnori_chat_messages',
  CURRENT_THEME: 'kinnori_current_theme',
} as const;

// Generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Bot profiles management
export function useBotProfiles() {
  const [botProfiles, setBotProfiles] = useState<BotProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOT_PROFILES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveBotProfiles = (profiles: BotProfile[]) => {
    setBotProfiles(profiles);
    localStorage.setItem(STORAGE_KEYS.BOT_PROFILES, JSON.stringify(profiles));
  };

  const createBot = (botData: Omit<BotProfile, 'id' | 'createdAt' | 'updatedAt'>): BotProfile => {
    const newBot: BotProfile = {
      ...botData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedProfiles = [...botProfiles, newBot];
    saveBotProfiles(updatedProfiles);
    return newBot;
  };

  const updateBot = (id: string, updates: Partial<BotProfile>): BotProfile | null => {
    const index = botProfiles.findIndex(bot => bot.id === id);
    if (index === -1) return null;

    const updatedBot = {
      ...botProfiles[index],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedProfiles = [...botProfiles];
    updatedProfiles[index] = updatedBot;
    saveBotProfiles(updatedProfiles);
    return updatedBot;
  };

  const deleteBot = (id: string) => {
    const updatedProfiles = botProfiles.filter(bot => bot.id !== id);
    saveBotProfiles(updatedProfiles);
    
    // Also clear chat messages for this bot
    const chatKey = `${STORAGE_KEYS.CHAT_MESSAGES}_${id}`;
    localStorage.removeItem(chatKey);
  };

  return {
    botProfiles,
    createBot,
    updateBot,
    deleteBot,
  };
}

// CRITICAL FIX: Chat messages management with proper chronological ordering
export function useChatMessages(botProfileId: string) {
  const chatKey = `${STORAGE_KEYS.CHAT_MESSAGES}_${botProfileId}`;
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(chatKey);
      if (!stored) return [];
      
      const parsedMessages = JSON.parse(stored);
      
      // CRITICAL: Sort by timestamp to ensure chronological order (oldest first)
      return parsedMessages.sort((a: ChatMessage, b: ChatMessage) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB; // Ascending order (oldest to newest)
      });
    } catch {
      return [];
    }
  });

  const saveMessages = (newMessages: ChatMessage[]) => {
    // CRITICAL: Always sort chronologically before saving and setting state
    const sortedMessages = [...newMessages].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB; // Ascending order (oldest to newest)
    });
    
    setMessages(sortedMessages);
    localStorage.setItem(chatKey, JSON.stringify(sortedMessages));
  };

  const addMessage = (messageData: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: generateId(),
      timestamp: new Date(), // This ensures proper chronological ordering
    };

    // CRITICAL: Add new message and maintain chronological order
    const updatedMessages = [...messages, newMessage];
    saveMessages(updatedMessages); // This will automatically sort chronologically
    
    return newMessage;
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(chatKey);
  };

  return {
    messages, // These are now guaranteed to be in chronological order (sender ↔ receiver ↔ sender)
    addMessage,
    clearMessages,
  };
}

// Theme management
export function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) || 'wallflower';
    } catch {
      return 'wallflower';
    }
  });

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, newTheme);
  };

  return { theme, updateTheme };
}