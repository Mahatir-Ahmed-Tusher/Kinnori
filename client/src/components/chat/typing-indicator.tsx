import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BotProfile } from "@/types/schema";
import type { Theme } from "@/components/ui/theme-selector";

interface TypingIndicatorProps {
  botProfile: BotProfile;
  theme: Theme;
}

export function TypingIndicator({ botProfile, theme }: TypingIndicatorProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case 'wallflower':
        return {
          bubbleBg: 'bg-gray-200',
          dotColor: 'bg-gray-500'
        };
      case 'comic':
        return {
          bubbleBg: 'bg-gray-200',
          dotColor: 'bg-gray-500'
        };
      case 'neutral':
        return {
          bubbleBg: 'bg-gray-600',
          dotColor: 'bg-gray-400'
        };
      default:
        return {
          bubbleBg: 'bg-gray-200',
          dotColor: 'bg-gray-500'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex justify-start mb-3"
    >
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
        
        <motion.div 
          className={`${styles.bubbleBg} px-4 py-3 rounded-2xl rounded-bl-md shadow-sm`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex space-x-1">
            <motion.div
              className={`w-2 h-2 ${styles.dotColor} rounded-full`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0 
              }}
            />
            <motion.div
              className={`w-2 h-2 ${styles.dotColor} rounded-full`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.2 
              }}
            />
            <motion.div
              className={`w-2 h-2 ${styles.dotColor} rounded-full`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.4 
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}