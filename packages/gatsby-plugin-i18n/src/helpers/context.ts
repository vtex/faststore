import { createContext, useContext } from 'react'

interface LocalizationContextType {
  defaultLocale: string
  locale: string
}

export const LocalizationContext = createContext<LocalizationContextType>({
  defaultLocale: 'en',
  locale: 'en',
})

export const useLocalizationContext = () => useContext(LocalizationContext)
