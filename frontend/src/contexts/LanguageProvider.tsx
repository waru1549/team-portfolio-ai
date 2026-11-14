
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Language } from '../data/portfolioData'

import { LanguageContext } from './language-context'

const LANGUAGE_STORAGE_KEY = 'team-portfolio-ai-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en'
  }

  try {
    const savedLanguage = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    )

    if (savedLanguage === 'th' || savedLanguage === 'en') {
      return savedLanguage
    }
  } catch {
    // Use English when browser storage is unavailable.
  }

  return 'en'
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] =
    useState<Language>(getInitialLanguage)

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language

    try {
      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        language,
      )
    } catch {
      // The application remains usable without local storage.
    }
  }, [language])

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language, setLanguage],
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
