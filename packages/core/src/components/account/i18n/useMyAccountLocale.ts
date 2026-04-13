import { useState } from 'react'

const STORAGE_KEY = 'faststore-my-account-locale'
const DEFAULT_LOCALE = 'pt-BR'

function getStoredLocale(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LOCALE
}

export function useMyAccountLocale() {
  const [locale, setLocaleState] = useState<string>(getStoredLocale)

  function setLocale(newLocale: string) {
    localStorage.setItem(STORAGE_KEY, newLocale)
    setLocaleState(newLocale)
  }

  return { locale, setLocale }
}
