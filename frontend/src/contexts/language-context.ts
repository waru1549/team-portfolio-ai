
import { createContext, useContext } from 'react'

import type { Language } from '../data/portfolioData'

export interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
}

export const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined)

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider.',
    )
  }

  return context
}
