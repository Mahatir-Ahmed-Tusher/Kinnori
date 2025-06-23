import { motion } from "framer-motion";

interface TypingIndicatorProps {
  visible: boolean;
  avatarUrl?: string;
}

export function TypingIndicator({ visible, avatarUrl }: TypingIndicatorProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex justify-start"
    >
      <div className="flex items-end space-x-2">
        {avatarUrl && (
          <img 
            src={avatarUrl} 
            alt="Bot Avatar" 
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="bg-white border border-pink-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-pink-400 rounded-full"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-400 rounded-full"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-400 rounded-full"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
