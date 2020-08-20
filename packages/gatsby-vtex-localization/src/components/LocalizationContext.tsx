import * as React from 'react'
import { FC, useMemo, useContext, createContext } from 'react'

interface LocalizationContextType {
  defaultLocale: string
  locale: string
}

interface Props {
  defaultLocale: string
  locale: string
}

const LocalizationContext = createContext<LocalizationContextType>({ defaultLocale: 'en', locale: 'en' })

export const useLocalizationContext = () => useContext(LocalizationContext)

const LocalizationContextProvider: FC<Props> = ({ children, defaultLocale, locale }) => {
  const value = useMemo(() => {
    return {
      defaultLocale,
      locale
    }
  }, [defaultLocale, locale])

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}

export default LocalizationContextProvider
