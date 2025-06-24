import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ChatMessage, BotProfile } from "@/types/schema";
import type { Theme } from "@/components/ui/theme-selector";
import { Heart, ThumbsUp, Laugh, Angry, Frown, Sunrise as Surprise } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  botProfile: BotProfile;
  theme: Theme;
  isConsecutive?: boolean;
}

const reactions = [
  { icon: ThumbsUp, emoji: "👍", label: "Like" },
  { icon: Heart, emoji: "❤️", label: "Love" },
  { icon: Laugh, emoji: "😆", label: "Laugh" },
  { icon: Surprise, emoji: "😮", label: "Wow" },
  { icon: Frown, emoji: "😢", label: "Sad" },
  { icon: Angry, emoji: "😠", label: "Angry" },
];

export function MessageBubble({ message, botProfile, theme, isConsecutive = false }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showTimestamp, setShowTimestamp] = useState(false);
  
  const isUser = message.sender === 'user';

  const getThemeStyles = () => {
    switch (theme) {
      case 'wallflower':
        return {
          userBg: 'bg-blue-500',
          botBg: 'bg-gray-200',
          botText: 'text-gray-900',
          reactionBg: 'bg-white border border-gray-200'
        };
      case 'comic':
        return {
          userBg: 'bg-blue-500',
          botBg: 'bg-gray-200',
          botText: 'text-gray-900',
          reactionBg: 'bg-white border border-gray-200'
        };
      case 'neutral':
        return {
          userBg: 'bg-blue-500',
          botBg: 'bg-gray-600',
          botText: 'text-gray-100',
          reactionBg: 'bg-gray-700 border border-gray-600'
        };
      default:
        return {
          userBg: 'bg-blue-500',
          botBg: 'bg-gray-200',
          botText: 'text-gray-900',
          reactionBg: 'bg-white border border-gray-200'
        };
    }
  };

  const styles = getThemeStyles();

  const getAvatarUrl = () => {
    if (botProfile.avatarFile) return botProfile.avatarFile;
    if (botProfile.avatarUrl) return botProfile.avatarUrl;
    return null;
  };

  const avatarUrl = getAvatarUrl();

  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleReactionSelect = (emoji: string) => {
    setSelectedReaction(selectedReaction === emoji ? null : emoji);
    setShowReactions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mb-1' : 'mb-3'} group`}
    >
      {isUser ? (
        // User message - Messenger style
        <div className="flex items-end space-x-2 max-w-[70%]">
          <div className="flex flex-col items-end">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setShowTimestamp(true)}
              onHoverEnd={() => setShowTimestamp(false)}
              className={`${styles.userBg} text-white px-4 py-2 rounded-2xl ${isConsecutive ? 'rounded-br-lg' : 'rounded-br-md'} shadow-sm relative cursor-pointer max-w-full`}
            >
              <p className="text-sm whitespace-pre-wrap break-words font-bengali leading-relaxed">
                {message.message}
              </p>
              
              {/* Timestamp on hover */}
              {showTimestamp && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-8 right-0 bg-black/75 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-50"
                >
                  {timestamp}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      ) : (
        // Bot message - Messenger style with avatar
        <div className="flex items-start space-x-2 max-w-[70%]">
          {/* Bot Avatar - Consistent with uploaded image */}
          <div className="flex-shrink-0">
            <Avatar className="w-7 h-7 shadow-sm">
              {avatarUrl ? (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={`${botProfile.name} avatar`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-xs font-bold">
                  {botProfile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="flex flex-col min-w-0 flex-1">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => {
                  setShowTimestamp(true);
                  setShowReactions(true);
                }}
                onHoverEnd={() => {
                  setShowTimestamp(false);
                  setShowReactions(false);
                }}
                className={`${styles.botBg} ${styles.botText} px-4 py-2 rounded-2xl ${isConsecutive ? 'rounded-bl-lg' : 'rounded-bl-md'} shadow-sm relative cursor-pointer max-w-full`}
              >
                <p className="text-sm whitespace-pre-wrap break-words font-bengali leading-relaxed">
                  {message.message}
                </p>
                
                {/* Timestamp on hover */}
                {showTimestamp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-8 left-0 bg-black/75 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-50"
                  >
                    {timestamp}
                  </motion.div>
                )}
                
                {/* Reaction selector */}
                {showReactions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`absolute -bottom-12 left-0 ${styles.reactionBg} rounded-full px-2 py-1 shadow-xl flex items-center space-x-1 z-50`}
                  >
                    {reactions.map((reaction) => (
                      <Button
                        key={reaction.label}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8 rounded-full hover:bg-gray-100 transition-all"
                        onClick={() => handleReactionSelect(reaction.emoji)}
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                      </Button>
                    ))}
                  </motion.div>
                )}
                
                {/* Selected reaction */}
                {selectedReaction && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-lg border-2 border-white"
                  >
                    <span className="text-sm block p-1">{selectedReaction}</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}