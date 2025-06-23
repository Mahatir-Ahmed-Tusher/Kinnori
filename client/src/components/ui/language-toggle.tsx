import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
          language === 'en'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-gray-600'
        }`}
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all font-bengali ${
          language === 'bn'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-gray-600'
        }`}
        onClick={() => setLanguage('bn')}
      >
        বাং
      </Button>
    </div>
  );
}
