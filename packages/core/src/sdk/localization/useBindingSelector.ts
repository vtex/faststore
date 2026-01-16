import { useCallback, useMemo, useState } from 'react'

import storeConfig from '../../../discovery.config'
import { useSession } from '../session'
import {
  buildLanguageOptions,
  getCurrenciesForLocale,
  isValidUrl,
  resolveBinding,
} from './bindingSelector'
import type { BindingSelectorError, Locale } from './types'

interface Currency {
  code: string
  name: string
  symbol: string
}

interface Region {
  code: string
  name: string
  dateFormat: string
  timeFormat: string
  timeFormatMask: string
  unitSystem: string
  defaultTimezone: string
}

interface LocalizationConfig {
  defaultLocale: string
  regions: Record<string, Region>
  locales: Record<string, Locale>
  currencies: Record<string, Currency>
}

/**
 * Hook return type for useBindingSelector.
 */
export interface UseBindingSelectorReturn {
  /** Language options as { localeCode: languageName } for UISelectField */
  languages: Record<string, string>
  /** Currency options as { currencyCode: currencyCode } for UISelectField */
  currencies: Record<string, string>
  /** Selected locale code (e.g., "pt-BR") */
  localeCode: string | null
  /** Selected currency code (e.g., "BRL") */
  currencyCode: string | null
  /** True when both locale and currency are selected and no error */
  isSaveEnabled: boolean
  /** Current error state, if any */
  error: BindingSelectorError | null
  /** Action to set the locale code (e.g., "pt-BR") */
  setLocaleCode: (code: string) => void
  /** Action to set the currency code */
  setCurrencyCode: (code: string) => void
  /** Action to save selections and redirect */
  save: () => void
}

/**
 * Hook that provides state and actions for the localization selector.
 * Manages locale selection, currency filtering, and binding resolution.
 *
 * @returns Object with languages, currencies, selections, and actions
 */
export function useBindingSelector(): UseBindingSelectorReturn {
  const { locale: currentLocale, currency: currentCurrency } = useSession()
  const localizationConfig = storeConfig.localization as LocalizationConfig

  // Pre-select current locale code and currency code from session
  const [localeCode, setLocaleCode] = useState<string | null>(
    () => currentLocale ?? null
  )
  const [currencyCode, setCurrencyCode] = useState<string | null>(
    () => currentCurrency?.code ?? null
  )
  const [error, setError] = useState<BindingSelectorError | null>(null)

  // Build language options with disambiguation - returns Record<localeCode, languageName>
  const languages = useMemo(
    () => buildLanguageOptions(localizationConfig.locales),
    [localizationConfig.locales]
  )

  // Filter currencies based on selected locale
  const currencies = useMemo(() => {
    if (!localeCode || !localizationConfig.locales[localeCode]) {
      return {}
    }
    const currencyList = getCurrenciesForLocale(
      localizationConfig.locales[localeCode]
    )
    // Convert array to Record<string, string> for UISelectField
    return Object.fromEntries(currencyList.map((code) => [code, code]))
  }, [localeCode, localizationConfig.locales])

  // Handle locale code change
  const handleSetLocaleCode = useCallback(
    (code: string) => {
      setLocaleCode(code)
      setError(null)

      // Check if current currency is available in new locale
      const locale = localizationConfig.locales[code]
      if (locale) {
        const availableCurrencies = getCurrenciesForLocale(locale)

        if (availableCurrencies.length === 0) {
          setError({ type: 'no-currencies', locale: code })
          setCurrencyCode(null)
        } else {
          const currencyStillValid =
            currencyCode && availableCurrencies.includes(currencyCode)
          if (!currencyStillValid) {
            // Auto-select first currency if only one available, otherwise clear
            setCurrencyCode(
              availableCurrencies.length === 1 ? availableCurrencies[0] : null
            )
          }
        }
      }
    },
    [localizationConfig.locales, currencyCode]
  )

  // Handle currency code change
  const handleSetCurrencyCode = useCallback((code: string) => {
    setCurrencyCode(code)
    setError(null)
  }, [])

  // Save and redirect
  const save = useCallback(() => {
    if (!localeCode || !currencyCode) return

    const locale = localizationConfig.locales[localeCode]
    if (!locale) {
      setError({
        type: 'no-binding-found',
        locale: localeCode,
        currency: currencyCode,
      })
      return
    }

    const binding = resolveBinding(locale.bindings, currencyCode)

    if (!binding) {
      setError({
        type: 'no-binding-found',
        locale: localeCode,
        currency: currencyCode,
      })
      return
    }

    if (!isValidUrl(binding.url)) {
      setError({ type: 'invalid-url', url: binding.url })
      return
    }

    // Redirect to binding URL
    window.location.href = binding.url
  }, [localeCode, currencyCode, localizationConfig.locales])

  const isSaveEnabled = Boolean(localeCode && currencyCode && !error)

  return {
    languages,
    currencies,
    localeCode,
    currencyCode,
    isSaveEnabled,
    error,
    setLocaleCode: handleSetLocaleCode,
    setCurrencyCode: handleSetCurrencyCode,
    save,
  }
}
