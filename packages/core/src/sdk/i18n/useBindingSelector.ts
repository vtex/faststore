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
  canSave: boolean
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
 * Provides state and actions for selecting a locale and currency and for resolving the corresponding binding URL.
 *
 * Exposes language and currency option maps, the current selections and error state, setters to update selections,
 * a readiness flag, and a save action that validates the selection and redirects to the resolved binding URL.
 *
 * @returns An object with the following properties:
 *  - `languages`: Record of available locale codes to display names
 *  - `currencies`: Record of available currency codes (filtered by selected locale)
 *  - `localeCode`: currently selected locale code or `null`
 *  - `currencyCode`: currently selected currency code or `null`
 *  - `canSave`: `true` when both `localeCode` and `currencyCode` are selected and there is no error, `false` otherwise
 *  - `error`: current `BindingSelectorError` or `null`
 *  - `setLocaleCode`: function to update the selected locale code
 *  - `setCurrencyCode`: function to update the selected currency code
 *  - `save`: function that validates the selection, resolves a binding, and redirects to its URL when valid
 */
export function useBindingSelector(): UseBindingSelectorReturn {
  const { locale: currentLocale, currency: currentCurrency } = useSession()
  const i18nConfig = storeConfig.i18n as LocalizationConfig

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
    () => buildLanguageOptions(i18nConfig.locales),
    [i18nConfig.locales]
  )

  // Filter currencies based on selected locale
  const currencies = useMemo(() => {
    if (!localeCode || !i18nConfig.locales[localeCode]) {
      return {}
    }
    const currencyList = getCurrenciesForLocale(i18nConfig.locales[localeCode])
    // Convert array to Record<string, string> for UISelectField
    return Object.fromEntries(currencyList.map((code) => [code, code]))
  }, [localeCode, i18nConfig.locales])

  // Handle locale code change
  const handleSetLocaleCode = useCallback(
    (code: string) => {
      setLocaleCode(code)
      setError(null)

      // Check if current currency is available in new locale
      const locale = i18nConfig.locales[code]
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
    [i18nConfig.locales, currencyCode]
  )

  // Handle currency code change
  const handleSetCurrencyCode = useCallback((code: string) => {
    setCurrencyCode(code)
    setError(null)
  }, [])

  // Save and redirect
  const save = useCallback(() => {
    if (!localeCode || !currencyCode) return

    const locale = i18nConfig.locales[localeCode]
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
  }, [localeCode, currencyCode, i18nConfig.locales])

  const canSave = Boolean(localeCode && currencyCode && !error)

  return {
    languages,
    currencies,
    localeCode,
    currencyCode,
    canSave,
    error,
    setLocaleCode: handleSetLocaleCode,
    setCurrencyCode: handleSetCurrencyCode,
    save,
  }
}