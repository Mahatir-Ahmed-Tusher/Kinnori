import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
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
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const url = botProfile ? `/api/bot-profiles/${botProfile.id}` : '/api/bot-profiles';
      const method = botProfile ? 'PUT' : 'POST';
      return await apiRequest(method, url, data);
    },
    onSuccess: async (response) => {
      const updatedProfile = await response.json();
      onSave?.(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['/api/bot-profiles'] });
      toast({
        title: "Success",
        description: botProfile ? "Bot profile updated successfully!" : "Bot profile created successfully!",
      });
      onOpenChange(false);
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
        description: "Failed to save bot profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
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

            {/* Avatar URL */}
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customize.avatar')}</FormLabel>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={field.value || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'} 
                      alt="Avatar Preview" 
                      className="w-16 h-16 rounded-full object-cover" 
                    />
                    <div className="flex-1">
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://example.com/avatar.jpg"
                          className="rounded-lg" 
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('customize.image-format')}
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
                disabled={mutation.isPending}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {mutation.isPending ? t('common.loading') : t('customize.save')}
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
