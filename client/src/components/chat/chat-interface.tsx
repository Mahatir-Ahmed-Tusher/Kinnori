import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { useChat } from "@/hooks/useChat";
import { useLanguage } from "@/hooks/useLanguage";
import type { BotProfile } from "@shared/schema";
import type { Theme } from "@/components/ui/theme-selector";
import { Send, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatInterfaceProps {
  botProfile: BotProfile;
  theme: Theme;
}

export function ChatInterface({ botProfile, theme }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, sendMessage, isLoading } = useChat(botProfile.id);
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage.trim();
    setInputMessage("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'wallflower':
        return 'wallflower-theme';
      case 'comic':
        return 'comic-theme';
      case 'neutral':
        return 'neutral-theme';
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${getThemeClasses()}`}>
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {/* Welcome message if no chat history */}
          {messages.length === 0 && (
            <MessageBubble
              message={{
                id: 'welcome',
                userId: '',
                botProfileId: botProfile.id,
                message: t('dashboard.welcome-message').replace('{name}', botProfile.name),
                sender: 'bot',
                timestamp: new Date(),
              }}
              avatarUrl={botProfile.avatarUrl || undefined}
              theme={theme}
            />
          )}
          
          {/* Chat messages */}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              avatarUrl={message.sender === 'bot' ? botProfile.avatarUrl || undefined : undefined}
              theme={theme}
            />
          ))}
          
          {/* Typing indicator */}
          <TypingIndicator 
            visible={isLoading} 
            avatarUrl={botProfile.avatarUrl || undefined}
          />
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.placeholder')}
              className="bg-gray-50/80 border-gray-200 rounded-2xl pr-12 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-pink-400 to-rose-500 text-white p-3 rounded-full hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {t('chat.language-note')}
        </p>
      </div>
    </div>
  );
}
