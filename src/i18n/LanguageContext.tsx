import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { fr } from './fr';
import { en } from './en';
import type { Language, Translations } from './types';

const STORAGE_KEY = 'lavabow_lang';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'fr',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: fr,
});

const dictionaries: Record<Language, Translations> = { fr, en };

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  return 'fr';
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: dictionaries[language],
    }),
    [language, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
