'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { createElement } from 'react';
import en from './en';
import ko from './ko';

type Locale = 'en' | 'ko';

const translations: Record<Locale, Record<string, string>> = { en, ko };

interface LanguageContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  toggleLocale: () => {},
  t: (key) => key,
});

export function useT() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && (stored === 'en' || stored === 'ko')) {
      setLocale(stored);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === 'en' ? 'ko' : 'en';
      localStorage.setItem('locale', next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let str = translations[locale]?.[key] ?? translations.en[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale]
  );

  return createElement(
    LanguageContext.Provider,
    { value: { locale, toggleLocale, t } },
    children
  );
}
