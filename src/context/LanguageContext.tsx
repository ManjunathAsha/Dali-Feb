import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import type { Translations } from '../common/types/Language.d';
import commonTranslations from "../common/languages/nl";

// Props for the LanguageProvider component
interface LanguageContextProps {
  children: ReactNode;
  appTranslations: Translations;
}

// Value interface for the LanguageContext
interface LanguageContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  showTranslationPrompt: boolean;
  setShowTranslationPrompt: (show: boolean) => void;
}

// Create the LanguageContext with an initial value of undefined
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

// LanguageProvider component to manage language state and translations
export const LanguageProvider: React.FC<LanguageContextProps> = ({ children, appTranslations }) => {
  // State for the selected language
  const [language, setLanguage] = useState('en'); // Default language is English
  const [showTranslationPrompt, setShowTranslationPrompt] = useState(false);

  // Combine generic and app-specific translations
  const translations: Translations = {
    ...commonTranslations,
    ...appTranslations,
  };

  useEffect(() => {
    const detectLanguage = () => {
      const userLanguage = navigator.language.split('-')[0];
      const supportedLanguages = ['en', 'nl']; // Add more as needed
      if (supportedLanguages.includes(userLanguage) && userLanguage !== language) {
        setShowTranslationPrompt(true);
      }
    };

    detectLanguage();
  }, [language]);

  // Translation function that retrieves the translation for a given key
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let currentTranslation: any = translations;

    for (const k of keys) {
      if (typeof currentTranslation !== 'object' || currentTranslation === null) {
        return key; // If any key in the path is not found, return the original key
      }
      currentTranslation = currentTranslation[k];
    }

    if (typeof currentTranslation === 'string') {
      // Replace variables in the string
      if (variables) {
        return Object.entries(variables).reduce((acc, [variable, value]) => {
          const placeholder = `{{${variable}}}`;
          return acc.replace(new RegExp(placeholder, 'g'), String(value));
        }, currentTranslation);
      }
      return currentTranslation;
    } else {
      return key;
    }
  };

  // Provide the context value to the children components
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, showTranslationPrompt, setShowTranslationPrompt }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};