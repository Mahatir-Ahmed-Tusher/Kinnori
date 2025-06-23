import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useChatMessages } from '@/hooks/useLocalStorage';
import type { BotProfile, ChatMessage } from '@shared/schema';

// Direct API call to Gemini
async function callGeminiAPI(userMessage: string, botProfile: BotProfile, chatHistory: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch('/api/chat/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        botProfile,
        chatHistory,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export function useChat(botProfileId: string, botProfile: BotProfile) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { messages, addMessage } = useChatMessages(botProfileId);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Add user message
      const userMessage = addMessage({
        botProfileId,
        message: message.trim(),
        sender: 'user',
      });

      // Get AI response
      const aiResponse = await callGeminiAPI(message.trim(), botProfile, messages);
      
      // Add AI response
      addMessage({
        botProfileId,
        message: aiResponse,
        sender: 'bot',
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
