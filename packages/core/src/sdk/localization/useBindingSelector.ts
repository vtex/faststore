import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import storeConfig from '../../../discovery.config'
import { buildRedirectUrl } from '../../utils/localization/bindingPaths'
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
  /** Discards unsaved changes and resets selections to current session values */
  reset: () => void
}

/**
 * Hook that provides state and actions for the localization selector.
 * Manages locale selection, currency filtering, and binding resolution.
 *
 * @param otherLocales - Optional list of localized slugs for the current product.
 *   When provided (e.g. on PDP), the save action navigates to the localized product
 *   URL instead of preserving the current page path verbatim.
 * @returns Object with languages, currencies, selections, and actions
 */
export function useBindingSelector(
  otherLocales?: Array<{ locale: string; slug: string }> | null
): UseBindingSelectorReturn {
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

  const hasUserEditedSelection = useRef(false)

  // Sync selections when session resolves after initial render (e.g. stale session
  // from a previous locale when navigating between locale-prefixed paths).
  // Skipped once the user has made an in-progress selection; call reset() on close to re-enable.
  useEffect(() => {
    if (!hasUserEditedSelection.current) {
      setLocaleCode(currentLocale ?? null)
    }
  }, [currentLocale])

  useEffect(() => {
    if (!hasUserEditedSelection.current) {
      setCurrencyCode(currentCurrency?.code ?? null)
    }
  }, [currentCurrency?.code])

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
      hasUserEditedSelection.current = true
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
    hasUserEditedSelection.current = true
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

    // On PDP: navigate to the localized product URL
    if (otherLocales?.length) {
      // 1. Target locale has a specific translation → use it
      const localizedEntry = otherLocales.find((e) => e.locale === localeCode)

      // 2. No translation for target locale → fall back to the default locale slug
      //    (IS linkText, always in the default locale) to avoid carrying over a
      //    translated slug from a different locale (e.g. Italian slug on es-ES)
      const fallbackEntry = otherLocales.find(
        (e) => e.locale === localizationConfig.defaultLocale
      )

      const entry = localizedEntry ?? fallbackEntry

      if (entry) {
        const baseUrl = binding.url.replace(/\/$/, '')
        window.location.href = `${baseUrl}/${entry.slug}/p${window.location.search}${window.location.hash}`
        return
      }
    }

    // Outside PDP: redirect to binding URL, preserving the current page path
    window.location.href = buildRedirectUrl(
      binding.url,
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    )
  }, [
    localeCode,
    currencyCode,
    localizationConfig.locales,
    localizationConfig.defaultLocale,
    otherLocales,
  ])

  const isSaveEnabled = Boolean(localeCode && currencyCode && !error)

  // Discards unsaved changes and re-enables session syncing
  const reset = useCallback(() => {
    hasUserEditedSelection.current = false
    setLocaleCode(currentLocale ?? null)
    setCurrencyCode(currentCurrency?.code ?? null)
    setError(null)
  }, [currentLocale, currentCurrency?.code])

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
    reset,
  }
}
