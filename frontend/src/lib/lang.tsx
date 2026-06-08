'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the languages available
export const languages = {
  vi: 'Tiếng Việt',
  en: 'English'
};

// Default language
export const defaultLang = 'vi';

// Translation objects (imported from i18n)
import { vi as viTranslations, en as enTranslations } from './i18n';

const translations = {
  vi: viTranslations,
  en: enTranslations
};

// Create context type
interface LangContextType {
  lang: string;
  t: (key: string) => string;
  setLang: (lang: 'vi' | 'en') => void;
}

// Create context with default values
const LangContext = createContext<LangContextType>({
  lang: defaultLang,
  t: () => '',
  setLang: () => {}
});

// Custom hook to use language context
export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};

// Provider component
export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState(() => {
    // Try to get from localStorage, fallback to default
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || defaultLang;
    }
    return defaultLang;
  });

  const setLang = (newLang: 'vi' | 'en') => {
    setLangState(newLang);
  };

  // Update HTML lang attribute and localStorage when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
      localStorage.setItem('lang', lang);
    }
  }, [lang]);

  // Translation function
  const t = (key: string): string => {
    // Split key by dots to navigate nested objects
    const keys = key.split('.');
    let value: any = translations[lang as keyof typeof translations];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const kFallback of keys) {
          if (value && typeof value === 'object' && kFallback in value) {
            value = value[kFallback];
          } else {
            return key; // Return the key itself if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
};