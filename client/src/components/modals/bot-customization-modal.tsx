import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useBotProfiles } from "@/hooks/useLocalStorage";
import { insertBotProfileSchema } from "@shared/schema";
import type { BotProfile } from "@shared/schema";
import type { Theme } from "@/components/ui/theme-selector";
import { z } from "zod";

interface BotCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botProfile?: BotProfile;
  onSave?: (profile: BotProfile) => void;
}

const formSchema = insertBotProfileSchema.extend({
  theme: z.enum(['wallflower', 'comic', 'neutral']),
  avatarFile: z.string().optional(),
});

export function BotCustomizationModal({ 
  open, 
  onOpenChange, 
  botProfile,
  onSave
}: BotCustomizationModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('wallflower');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { createBot, updateBot } = useBotProfiles();

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAvatarPreview(base64);
        form.setValue('avatarFile', base64);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    form.setValue('avatarFile', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: botProfile?.name || 'Aria',
      gender: botProfile?.gender || 'female',
      role: botProfile?.role || 'friend',
      tone: botProfile?.tone || 'empathetic',
      backstory: botProfile?.backstory || '',
      avatarUrl: botProfile?.avatarUrl || '',
      theme: (botProfile?.theme as Theme) || 'wallflower',
    },
  });

  useEffect(() => {
    if (botProfile) {
      form.reset({
        name: botProfile.name,
        gender: botProfile.gender,
        role: botProfile.role,
        tone: botProfile.tone,
        backstory: botProfile.backstory || '',
        avatarUrl: botProfile.avatarUrl || '',
        theme: (botProfile.theme as Theme) || 'wallflower',
      });
      setSelectedTheme((botProfile.theme as Theme) || 'wallflower');
    }
  }, [botProfile, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      // Use avatar file data if uploaded, otherwise use URL
      const finalData = {
        ...data,
        avatarUrl: avatarPreview || data.avatarUrl || '',
      };
      
      let savedProfile: BotProfile;
      
      if (botProfile) {
        // Update existing bot
        savedProfile = updateBot(botProfile.id, finalData) as BotProfile;
      } else {
        // Create new bot
        savedProfile = createBot(finalData);
      }
      
      if (savedProfile) {
        onSave?.(savedProfile);
        toast({
          title: "Success",
          description: botProfile ? "Bot profile updated successfully!" : "Bot profile created successfully!",
        });
        onOpenChange(false);
        // Reset form and avatar preview
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bot profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getThemeStyles = (theme: Theme) => {
    switch (theme) {
      case 'wallflower':
        return 'border-pink-300 bg-pink-50';
      case 'comic':
        return 'border-yellow-300 bg-yellow-50';
      case 'neutral':
        return 'border-gray-400 bg-gray-100';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('customize.title')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.gender')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="female">{t('customize.gender.female')}</SelectItem>
                      <SelectItem value="male">{t('customize.gender.male')}</SelectItem>
                      <SelectItem value="non-binary">{t('customize.gender.non-binary')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.role')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="friend">{t('customize.role.friend')}</SelectItem>
                      <SelectItem value="romantic-partner">{t('customize.role.romantic-partner')}</SelectItem>
                      <SelectItem value="therapist">{t('customize.role.therapist')}</SelectItem>
                      <SelectItem value="mentor">{t('customize.role.mentor')}</SelectItem>
                      <SelectItem value="family-member">{t('customize.role.family-member')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tone */}
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.tone')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="empathetic">{t('customize.tone.empathetic')}</SelectItem>
                      <SelectItem value="romantic">{t('customize.tone.romantic')}</SelectItem>
                      <SelectItem value="humorous">{t('customize.tone.humorous')}</SelectItem>
                      <SelectItem value="professional">{t('customize.tone.professional')}</SelectItem>
                      <SelectItem value="casual">{t('customize.tone.casual')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Theme */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.theme')}</FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {(['wallflower', 'comic', 'neutral'] as Theme[]).map((theme) => (
                      <Button
                        key={theme}
                        type="button"
                        variant="outline"
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          field.value === theme ? getThemeStyles(theme) : 'border-gray-200 bg-gray-50'
                        }`}
                        onClick={() => {
                          field.onChange(theme);
                          setSelectedTheme(theme);
                        }}
                      >
                        <div className="text-2xl mb-1">
                          {theme === 'wallflower' && '🌸'}
                          {theme === 'comic' && '🎉'}
                          {theme === 'neutral' && '🌙'}
                        </div>
                        <div className="text-sm font-medium">
                          {theme === 'wallflower' && 'Wallflower'}
                          {theme === 'comic' && 'ComicPal'}
                          {theme === 'neutral' && 'NeutralNight'}
                        </div>
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Avatar Upload */}
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage 
                        src={avatarPreview || field.value || ''} 
                        alt="Avatar Preview" 
                      />
                      <AvatarFallback>
                        {form.watch('name')?.charAt(0)?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center space-x-2"
                        >
                          <Upload size={16} />
                          <span>Upload Image</span>
                        </Button>
                        {(avatarPreview || field.value) && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeAvatar}
                            className="flex items-center space-x-2"
                          >
                            <X size={16} />
                            <span>Remove</span>
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Or paste image URL"
                          className="rounded-lg" 
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value && !avatarPreview) {
                              // Clear file input if URL is entered
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        JPG, PNG up to 2MB
                      </p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Backstory */}
            <FormField
              control={form.control}
              name="backstory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.backstory')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      className="rounded-xl resize-none"
                      placeholder={t('customize.backstory.placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl font-medium"
              >
                {t('customize.cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
