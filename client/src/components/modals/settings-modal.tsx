import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [showTypingIndicators, setShowTypingIndicators] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);

  const clearChatsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', '/api/chat-messages');
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "All conversations have been cleared.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to clear conversations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClearConversations = () => {
    if (confirm("Are you sure you want to clear all conversations? This action cannot be undone.")) {
      clearChatsMutation.mutate();
    }
  };

  const handleSaveSettings = () => {
    // Save settings to local storage
    localStorage.setItem('kinnori-settings', JSON.stringify({
      showTypingIndicators,
      soundNotifications,
    }));
    
    toast({
      title: "Success",
      description: "Settings saved successfully!",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('settings.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language Setting */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {t('settings.language')}
            </Label>
            <div className="flex space-x-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                className="flex-1 rounded-xl"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button
                variant={language === 'bn' ? 'default' : 'outline'}
                className="flex-1 rounded-xl font-bengali"
                onClick={() => setLanguage('bn')}
              >
                বাংলা
              </Button>
            </div>
          </div>

          {/* Chat Preferences */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t('settings.chat-preferences')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="typing-indicators" className="text-sm">
                  {t('settings.typing-indicators')}
                </Label>
                <Switch
                  id="typing-indicators"
                  checked={showTypingIndicators}
                  onCheckedChange={setShowTypingIndicators}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-notifications" className="text-sm">
                  {t('settings.sound-notifications')}
                </Label>
                <Switch
                  id="sound-notifications"
                  checked={soundNotifications}
                  onCheckedChange={setSoundNotifications}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t('settings.data-management')}
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl"
                onClick={() => {
                  // TODO: Implement export functionality
                  toast({
                    title: "Coming Soon",
                    description: "Export functionality will be available soon.",
                  });
                }}
              >
                {t('settings.export-history')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleClearConversations}
                disabled={clearChatsMutation.isPending}
              >
                {clearChatsMutation.isPending ? t('common.loading') : t('settings.clear-conversations')}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            {t('settings.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
