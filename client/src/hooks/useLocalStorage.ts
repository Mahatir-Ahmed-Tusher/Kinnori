import { useState, useEffect } from 'react';
import type { BotProfile, ChatMessage } from '@shared/schema';

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
      const stored = sessionStorage.getItem(STORAGE_KEYS.BOT_PROFILES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveBotProfiles = (profiles: BotProfile[]) => {
    setBotProfiles(profiles);
    sessionStorage.setItem(STORAGE_KEYS.BOT_PROFILES, JSON.stringify(profiles));
  };

  const createBot = (botData: Omit<BotProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): BotProfile => {
    const newBot: BotProfile = {
      ...botData,
      id: generateId(),
      userId: 'local-user',
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
    sessionStorage.removeItem(chatKey);
  };

  return {
    botProfiles,
    createBot,
    updateBot,
    deleteBot,
  };
}

// Chat messages management
export function useChatMessages(botProfileId: string) {
  const chatKey = `${STORAGE_KEYS.CHAT_MESSAGES}_${botProfileId}`;
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem(chatKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    sessionStorage.setItem(chatKey, JSON.stringify(newMessages));
  };

  const addMessage = (messageData: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: generateId(),
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    saveMessages(updatedMessages);
    return newMessage;
  };

  const clearMessages = () => {
    setMessages([]);
    sessionStorage.removeItem(chatKey);
  };

  return {
    messages,
    addMessage,
    clearMessages,
  };
}

// Theme management
export function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.CURRENT_THEME) || 'wallflower';
    } catch {
      return 'wallflower';
    }
  });

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_THEME, newTheme);
  };

  return { theme, updateTheme };
}