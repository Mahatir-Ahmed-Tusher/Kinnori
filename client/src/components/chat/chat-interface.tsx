import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { useChat } from "@/hooks/useChat";
import { useLanguage } from "@/hooks/useLanguage";
import type { BotProfile } from "@/types/schema";
import type { Theme } from "@/components/ui/theme-selector";
import { Send, Mic, Smile, Plus, Image } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  botProfile: BotProfile;
  theme: Theme;
}

export function ChatInterface({ botProfile, theme }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, sendMessage, isLoading } = useChat(botProfile.id, botProfile);
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const getThemeStyles = () => {
    switch (theme) {
      case 'wallflower':
        return {
          background: 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50',
          chatBg: 'bg-white',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          sendButton: 'bg-gradient-to-r from-purple-500 to-pink-500',
        };
      case 'comic':
        return {
          background: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50',
          chatBg: 'bg-white',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          sendButton: 'bg-gradient-to-r from-orange-400 to-yellow-500',
        };
      case 'neutral':
        return {
          background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900',
          chatBg: 'bg-slate-800',
          inputBg: 'bg-slate-700',
          inputBorder: 'border-slate-600',
          sendButton: 'bg-gradient-to-r from-indigo-500 to-purple-600',
        };
      default:
        return {
          background: 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50',
          chatBg: 'bg-white',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          sendButton: 'bg-gradient-to-r from-purple-500 to-pink-500',
        };
    }
  };

  const themeStyles = getThemeStyles();

  // CRITICAL FIX: Sort messages chronologically by timestamp
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Messages Area - Messenger Style with proper scrolling */}
      <div className="flex-1 relative">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4 space-y-2 max-w-4xl mx-auto min-h-full">
            {/* CRITICAL FIX: Display messages in chronological order */}
            <AnimatePresence>
              {sortedMessages.map((message, index) => {
                const prevMessage = index > 0 ? sortedMessages[index - 1] : undefined;
                const isConsecutive = 
                  prevMessage !== undefined && 
                  prevMessage.sender === message.sender &&
                  new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() < 60000;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    botProfile={botProfile}
                    theme={theme}
                    isConsecutive={isConsecutive}
                  />
                );
              })}
            </AnimatePresence>
            
            {/* Typing indicator */}
            <AnimatePresence>
              {isLoading && (
                <TypingIndicator 
                  botProfile={botProfile}
                  theme={theme}
                />
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input - Precise Messenger Style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${themeStyles.inputBg} border-t ${themeStyles.inputBorder} p-3 relative z-10`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            {/* Additional actions */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 mb-1 hover:bg-gray-100"
              disabled={isLoading}
            >
              <Plus className="w-5 h-5 text-blue-500" />
            </Button>
            
            {/* Message input container - Exact Messenger styling */}
            <div className="flex-1 relative">
              <div className={`flex items-center ${themeStyles.chatBg} rounded-full border ${themeStyles.inputBorder} shadow-sm min-h-[40px]`}>
                <div className="flex-1 flex items-center px-4 py-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chat.placeholder')}
                    className={`border-0 bg-transparent focus:ring-0 focus:outline-none resize-none font-bengali text-base h-auto p-0 ${theme === 'neutral' ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'}`}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center space-x-1 pr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-1.5 hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <Image className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-1.5 hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <Smile className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Send/Mic button - Messenger style */}
            {inputMessage.trim() ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Button
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`${themeStyles.sendButton} text-white rounded-full w-8 h-8 p-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none mb-1`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 mb-1 hover:bg-gray-100"
                disabled={isLoading}
              >
                <Mic className="w-5 h-5 text-blue-500" />
              </Button>
            )}
          </div>
          
          {/* Language note */}
          <p className={`text-xs ${theme === 'neutral' ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center font-bengali`}>
            {t('chat.language-note')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}