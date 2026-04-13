import { createContext, useContext, type PropsWithChildren } from 'react'
import { IntlProvider } from 'react-intl'
import { useMyAccountLocale } from './useMyAccountLocale'
import enUS from './messages/en-US.json'
import ptBR from './messages/pt-BR.json'

const messages: Record<string, Record<string, string>> = {
  'en-US': enUS,
  'pt-BR': ptBR,
}

interface LocaleContextValue {
  locale: string
  setLocale: (locale: string) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'pt-BR',
  setLocale: () => {},
})

export function useLocaleContext() {
  return useContext(LocaleContext)
}

export function MyAccountIntlProvider({ children }: PropsWithChildren) {
  const { locale, setLocale } = useMyAccountLocale()
  const currentMessages = messages[locale] ?? messages['en-US']

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        locale={locale}
        messages={currentMessages}
        defaultLocale="en-US"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}
