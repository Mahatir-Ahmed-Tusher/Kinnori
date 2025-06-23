import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useBotProfiles, useTheme } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeSelector, type Theme } from "@/components/ui/theme-selector";
import { ChatInterface } from "@/components/chat/chat-interface";
import { BotCustomizationModal } from "@/components/modals/bot-customization-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import type { BotProfile } from "@shared/schema";
import { Heart, Settings, Edit, Plus, MessageCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { botProfiles } = useBotProfiles();
  const { theme: currentTheme, updateTheme } = useTheme();
  
  const [selectedBotProfile, setSelectedBotProfile] = useState<BotProfile | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Show welcome message with session storage warning
  useEffect(() => {
    if (showWelcomeMessage) {
      toast({
        title: "Welcome to Kinnori!",
        description: "Your data is stored locally for this session only. Everything will reset when you close or refresh the page.",
        duration: 8000,
      });
      setShowWelcomeMessage(false);
    }
  }, [showWelcomeMessage, toast]);

  // Set default bot profile when profiles load
  useEffect(() => {
    if (botProfiles.length > 0 && !selectedBotProfile) {
      const defaultProfile = botProfiles[0] as BotProfile;
      setSelectedBotProfile(defaultProfile);
      updateTheme((defaultProfile.theme as Theme) || 'wallflower');
    }
  }, [botProfiles, selectedBotProfile, updateTheme]);

  // Auto-create first bot profile if none exist
  useEffect(() => {
    if (botProfiles.length === 0) {
      setShowCreateBot(true);
    }
  }, [botProfiles]);

  const handleBotProfileSelect = (profile: BotProfile) => {
    setSelectedBotProfile(profile);
    updateTheme((profile.theme as Theme) || 'wallflower');
  };

  const handleBotProfileSaved = (profile: BotProfile) => {
    setSelectedBotProfile(profile);
    updateTheme((profile.theme as Theme) || 'wallflower');
    setShowCreateBot(false);
  };

  const handleThemeChange = (theme: Theme) => {
    updateTheme(theme);
  };

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'wallflower':
        return 'wallflower-theme';
      case 'comic':
        return 'comic-theme';
      case 'neutral':
        return 'neutral-theme';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="text-white" size={16} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Kinnori</h1>
              <div className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                Session Only - Data resets on page refresh
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar - Bot Profiles */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Companions</h2>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateBot(true)}
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Bot Profiles List */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-3">
                  <AnimatePresence>
                    {botProfiles.map((profile: BotProfile) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedBotProfile?.id === profile.id
                            ? 'border-indigo-300 bg-indigo-50'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => handleBotProfileSelect(profile)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={profile.avatarUrl || ''} alt={profile.name} />
                            <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{profile.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBotProfile(profile);
                              setShowCustomizationModal(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {botProfiles.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">No companions yet</p>
                      <Button
                        size="sm"
                        onClick={() => setShowCreateBot(true)}
                        className="mt-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg"
                      >
                        Create Your First Companion
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
              {selectedBotProfile ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={selectedBotProfile.avatarUrl || ''} alt={selectedBotProfile.name} />
                          <AvatarFallback>{selectedBotProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{selectedBotProfile.name}</h2>
                          <p className="text-sm text-gray-500 capitalize">
                            {selectedBotProfile.role} • {selectedBotProfile.tone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ThemeSelector
                          currentTheme={currentTheme as Theme}
                          onThemeChange={handleThemeChange}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCustomizationModal(true)}
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="flex-1 min-h-0">
                    <ChatInterface 
                      botProfile={selectedBotProfile} 
                      theme={currentTheme as Theme}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Kinnori</h3>
                    <p className="text-gray-500 mb-6">Select or create a companion to start chatting</p>
                    <Button
                      onClick={() => setShowCreateBot(true)}
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl"
                    >
                      <Plus size={16} className="mr-2" />
                      Create Your First Companion
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BotCustomizationModal
        open={showCustomizationModal || showCreateBot}
        onOpenChange={(open) => {
          setShowCustomizationModal(open);
          setShowCreateBot(open);
        }}
        botProfile={showCreateBot ? undefined : selectedBotProfile}
        onSave={handleBotProfileSaved}
      />

      <SettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
      />
    </div>
  );
}