import * as React from 'react'
import { FC, useMemo } from 'react'
import { LocalizationContext } from '../helpers/context'

interface Props {
  defaultLocale: string
  locale: string
}

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
