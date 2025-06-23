import { Button } from "@/components/ui/button";

export type Theme = 'wallflower' | 'comic' | 'neutral';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

export function ThemeSelector({ currentTheme, onThemeChange, className }: ThemeSelectorProps) {
  const getThemeDisplay = (theme: Theme) => {
    switch (theme) {
      case 'wallflower':
        return '🌸 Wallflower';
      case 'comic':
        return '🎉 ComicPal';
      case 'neutral':
        return '🌙 NeutralNight';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={() => {
        const themes: Theme[] = ['wallflower', 'comic', 'neutral'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        onThemeChange(themes[nextIndex]);
      }}
    >
      {getThemeDisplay(currentTheme)}
    </Button>
  );
}
