import { motion } from "framer-motion";
import type { ChatMessage } from "@shared/schema";
import type { Theme } from "@/components/ui/theme-selector";

interface MessageBubbleProps {
  message: ChatMessage;
  avatarUrl?: string;
  theme: Theme;
}

export function MessageBubble({ message, avatarUrl, theme }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  const getThemeStyles = () => {
    switch (theme) {
      case 'wallflower':
        return {
          userBg: 'bg-gradient-to-r from-pink-400 to-rose-500',
          botBg: 'bg-white border border-pink-200',
          botText: 'text-gray-700'
        };
      case 'comic':
        return {
          userBg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          botBg: 'bg-white border border-yellow-200',
          botText: 'text-gray-700'
        };
      case 'neutral':
        return {
          userBg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
          botBg: 'bg-gray-700 border border-gray-600',
          botText: 'text-gray-100'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {isUser ? (
        <div className={`${styles.userBg} text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs lg:max-w-md`}>
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
      ) : (
        <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
          {avatarUrl && (
            <img 
              src={avatarUrl} 
              alt="Bot Avatar" 
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div className={`${styles.botBg} ${styles.botText} px-4 py-3 rounded-2xl rounded-bl-md shadow-sm`}>
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
