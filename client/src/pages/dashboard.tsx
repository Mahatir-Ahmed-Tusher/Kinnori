import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
import type { BotProfile } from "@/types/schema";
import { Heart, Settings, Edit, Plus, MessageCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = 'companions' | 'chat';

export default function Dashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { botProfiles } = useBotProfiles();
  const { theme: currentTheme, updateTheme } = useTheme();
  const [, setLocation] = useLocation();
  
  const [selectedBotProfile, setSelectedBotProfile] = useState<BotProfile | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('companions');

  // Show welcome message
  useEffect(() => {
    if (showWelcomeMessage) {
      toast({
        title: "Welcome to Kinnori! 💕",
        description: "Your personalized AI emotional support companion is ready to chat with you.",
        duration: 6000,
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
    setViewMode('chat');
  };

  const handleBotProfileSaved = (profile: BotProfile) => {
    setSelectedBotProfile(profile);
    updateTheme((profile.theme as Theme) || 'wallflower');
    setShowCreateBot(false);
    setShowCustomizationModal(false);
    setViewMode('chat');
  };

  const handleThemeChange = (theme: Theme) => {
    updateTheme(theme);
  };

  const handleLogoClick = () => {
    setLocation('/');
  };

  const getAvatarUrl = (profile: BotProfile) => {
    if (profile.avatarFile) return profile.avatarFile;
    if (profile.avatarUrl) return profile.avatarUrl;
    return '';
  };

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'wallflower':
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50';
      case 'comic':
        return 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50';
      case 'neutral':
        return 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900';
      default:
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50';
    }
  };

  const isOnline = navigator.onLine;

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {/* Glassmorphic Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {viewMode === 'chat' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('companions')}
                  className="mr-2 hover:bg-white/20 rounded-full"
                >
                  <Home size={16} />
                </Button>
              )}
              <button 
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Heart className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Kinnori
                </h1>
              </button>
              {viewMode === 'chat' && selectedBotProfile && (
                <div className="flex items-center space-x-3 ml-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getAvatarUrl(selectedBotProfile)} alt={selectedBotProfile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-xs font-bold">
                      {selectedBotProfile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedBotProfile.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`}></div>
                      <span className="text-xs text-gray-600">
                        {isOnline ? 'Active now' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                title="Refresh App"
                className="hover:bg-white/20 rounded-full"
              >
                <RefreshCw size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsModal(true)}
                className="hover:bg-white/20 rounded-full"
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {viewMode === 'companions' ? (
          // Companions List View - Glassmorphic Design
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 min-h-[calc(100vh-12rem)]">
              {/* Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Your Companions
                    </h2>
                    <p className="text-gray-600">Choose a companion to start chatting or create a new one</p>
                  </div>
                  <Button
                    onClick={() => setShowCreateBot(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
                  >
                    <Plus size={16} className="mr-2" />
                    <span className="hidden sm:inline">New Companion</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </div>
              </div>

              {/* Companions Grid */}
              <div className="p-6">
                {botProfiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {botProfiles.map((profile: BotProfile) => (
                        <motion.div
                          key={profile.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="group relative bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-2xl hover:bg-white/80"
                          onClick={() => handleBotProfileSelect(profile)}
                        >
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                              <Avatar className="w-20 h-20 ring-4 ring-white/50 shadow-xl">
                                <AvatarImage src={getAvatarUrl(profile)} alt={profile.name} />
                                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                                  {profile.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 mb-1">{profile.name}</h3>
                              <p className="text-sm text-gray-600 capitalize mb-2">{profile.role}</p>
                              <div className="flex items-center justify-center space-x-2">
                                <span className="px-3 py-1 bg-purple-100/80 text-purple-700 text-xs rounded-full capitalize backdrop-blur-sm">
                                  {profile.tone}
                                </span>
                                <span className="px-3 py-1 bg-pink-100/80 text-pink-700 text-xs rounded-full capitalize backdrop-blur-sm">
                                  {profile.theme}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBotProfile(profile);
                              setShowCustomizationModal(true);
                            }}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30 rounded-full"
                          >
                            <Edit size={16} />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <MessageCircle className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No companions yet</h3>
                        <p className="text-gray-600 mb-6">Create your first AI companion to start chatting</p>
                      </div>
                      <Button
                        onClick={() => setShowCreateBot(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-8 py-3 text-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        <Plus size={20} className="mr-2" />
                        Create Your First Companion
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Chat View - Full Messenger Experience
          <div className="h-[calc(100vh-8rem)]">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 h-full flex flex-col overflow-hidden">
              {selectedBotProfile ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={getAvatarUrl(selectedBotProfile)} alt={selectedBotProfile.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-sm font-bold">
                          {selectedBotProfile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedBotProfile.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-gray-600">
                            {isOnline ? 'Active now' : 'Offline'}
                          </span>
                        </div>
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
                        className="hover:bg-white/20 rounded-full"
                      >
                        <Edit size={16} />
                      </Button>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No companion selected</h3>
                    <p className="text-gray-500 mb-6">Go back to select a companion</p>
                    <Button
                      onClick={() => setViewMode('companions')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Back to Companions
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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