import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import { translations } from '@/lib/translations';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('kinnori-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kinnori-language', language);
    
    // Apply Bengali font to body when Bengali is selected
    if (language === 'bn') {
      document.body.classList.add('font-bengali');
    } else {
      document.body.classList.remove('font-bengali');
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
