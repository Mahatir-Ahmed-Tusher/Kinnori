import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeSelector, type Theme } from "@/components/ui/theme-selector";
import { ChatInterface } from "@/components/chat/chat-interface";
import { BotCustomizationModal } from "@/components/modals/bot-customization-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import type { BotProfile } from "@shared/schema";
import { Heart, Settings, Edit, Plus, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedBotProfile, setSelectedBotProfile] = useState<BotProfile | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>('wallflower');
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateBot, setShowCreateBot] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: t('common.unauthorized'),
        description: t('common.unauthorized.description'),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast, t]);

  // Fetch bot profiles
  const { data: botProfiles = [], error: profilesError } = useQuery({
    queryKey: ['/api/bot-profiles'],
    enabled: !!user,
    retry: false,
  });

  // Handle unauthorized errors for bot profiles
  useEffect(() => {
    if (profilesError && isUnauthorizedError(profilesError)) {
      toast({
        title: t('common.unauthorized'),
        description: t('common.unauthorized.description'),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [profilesError, toast, t]);

  // Set default bot profile when profiles load
  useEffect(() => {
    if (botProfiles.length > 0 && !selectedBotProfile) {
      const defaultProfile = botProfiles[0] as BotProfile;
      setSelectedBotProfile(defaultProfile);
      setCurrentTheme((defaultProfile.theme as Theme) || 'wallflower');
    }
  }, [botProfiles, selectedBotProfile]);

  // Auto-create first bot profile if none exist
  useEffect(() => {
    if (user && botProfiles.length === 0 && !profilesError) {
      setShowCreateBot(true);
    }
  }, [user, botProfiles, profilesError]);

  const handleBotProfileSelect = (profile: BotProfile) => {
    setSelectedBotProfile(profile);
    setCurrentTheme((profile.theme as Theme) || 'wallflower');
  };

  const handleBotProfileSaved = (profile: BotProfile) => {
    setSelectedBotProfile(profile);
    setCurrentTheme((profile.theme as Theme) || 'wallflower');
    setShowCreateBot(false);
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    // TODO: Update bot profile theme in database
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="text-white" size={16} />
          </div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

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
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsModal(true)}
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-sm">
                    {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700 hidden sm:block">
                  {user.firstName || user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200">
          {/* Bot Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <AnimatePresence mode="wait">
              {selectedBotProfile ? (
                <motion.div
                  key={selectedBotProfile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-4 mb-4"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedBotProfile.avatarUrl || undefined} alt={selectedBotProfile.name} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-400 to-rose-500 text-white">
                      {selectedBotProfile.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{selectedBotProfile.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {t(`customize.role.${selectedBotProfile.role}` as any) || selectedBotProfile.role}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-16 text-gray-500"
                >
                  {t('common.loading')}
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button
              onClick={() => setShowCustomizationModal(true)}
              disabled={!selectedBotProfile}
              className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-0"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t('dashboard.customize-companion')}
            </Button>
          </div>

          {/* Bot Profiles List */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700 text-sm">
                  {t('dashboard.recent-conversations')}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedBotProfile(null);
                    setShowCustomizationModal(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-2">
                {botProfiles.map((profile: BotProfile) => (
                  <motion.button
                    key={profile.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBotProfileSelect(profile)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      selectedBotProfile?.id === profile.id
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatarUrl || undefined} alt={profile.name} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-400 to-rose-500 text-white text-xs">
                          {profile.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{profile.name}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {t(`customize.role.${profile.role}` as any) || profile.role}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
                
                {botProfiles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No companions yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setSelectedBotProfile(null);
                setShowCustomizationModal(true);
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('dashboard.new-conversation')}
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${getThemeClasses()}`}>
          {selectedBotProfile ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-700">
                    {t('dashboard.chatting-with')} <span className="text-indigo-600">{selectedBotProfile.name}</span>
                  </span>
                </div>
                <ThemeSelector
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeChange}
                  className="text-sm"
                />
              </div>

              {/* Chat Interface */}
              <ChatInterface
                botProfile={selectedBotProfile}
                theme={currentTheme}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto p-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to {t('app.name')}
                </h2>
                <p className="text-gray-600 mb-6">
                  Create your first AI companion to start having meaningful conversations and receive emotional support.
                </p>
                <Button
                  onClick={() => setShowCustomizationModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your Companion
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BotCustomizationModal
        open={showCustomizationModal || showCreateBot}
        onOpenChange={(open) => {
          setShowCustomizationModal(open);
          setShowCreateBot(open);
        }}
        botProfile={selectedBotProfile || undefined}
        onSave={handleBotProfileSaved}
      />

      <SettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
      />
    </div>
  );
}
