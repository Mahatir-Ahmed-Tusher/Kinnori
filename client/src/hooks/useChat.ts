import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useChatMessages } from '@/hooks/useLocalStorage';
import { generateAIResponse } from '@/lib/gemini';
import type { BotProfile, ChatMessage } from '@/types/schema';

export function useChat(botProfileId: string, botProfile: BotProfile) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { messages, addMessage } = useChatMessages(botProfileId);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    
    try {
      // CRITICAL FIX: Add user message first with proper timestamp
      const userMessage = addMessage({
        botProfileId,
        message: message.trim(),
        sender: 'user',
      });

      // Get AI response with the current message history
      // The messages array is already chronologically ordered from useChatMessages
      const aiResponse = await generateAIResponse(message.trim(), botProfile, messages);
      
      // CRITICAL FIX: Add AI response with a slightly later timestamp to ensure proper ordering
      // Add a small delay to ensure the bot message comes after the user message
      setTimeout(() => {
        addMessage({
          botProfileId,
          message: aiResponse,
          sender: 'bot',
        });
      }, 10); // 10ms delay to ensure proper chronological ordering

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please check your Gemini API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages, // These are guaranteed to be in chronological order (user → bot → user → bot)
    sendMessage,
    isLoading,
  };
}