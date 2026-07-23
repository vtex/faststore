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
import type { LocalizedProductLocale } from './LocalizedProductContext'
import type { BindingSelectorError, Locale } from './types'

const OTHER_LOCALES_STORAGE_PREFIX = 'fs:otherLocales:'

/**
 * Extracts the SKU id from a PDP-shaped pathname ("/.../{slug}-{skuId}/p").
 * Slugs always end with "-{skuId}" (see `getSlug` in the API), so the id is the
 * last "-"-separated segment of the path segment that precedes "/p".
 * Returns null when the path is not a product page or has no numeric id.
 */
export function getSkuIdFromPdpPath(pathname: string): string | null {
  const match = pathname.match(/\/([^/]+)\/p\/?$/) // NOSONAR
  const skuId = match?.[1]?.split('-').pop()

  return skuId && /^\d+$/.test(skuId) ? skuId : null
}

/**
 * Persists the localized slug map for a product keyed by its SKU id. This lets
 * the locale selector rebuild canonical localized product URLs even after the
 * user lands on a context-less page (e.g. a 404 for a locale where the product
 * is unavailable), where `otherLocales` is no longer provided by the page.
 */
export function persistOtherLocales(
  otherLocales: LocalizedProductLocale[]
): void {
  if (typeof window === 'undefined' || !otherLocales.length) return

  const skuId = otherLocales[0]?.slug.split('-').pop()
  if (!skuId) return

  try {
    globalThis.sessionStorage.setItem(
      `${OTHER_LOCALES_STORAGE_PREFIX}${skuId}`,
      JSON.stringify(otherLocales)
    )
  } catch {
    // sessionStorage may be unavailable (private mode/quota); non-critical.
  }
}

function isLocalizedProductLocaleArray(
  value: unknown
): value is LocalizedProductLocale[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).locale === 'string' &&
        typeof (item as Record<string, unknown>).slug === 'string'
    )
  )
}

/**
 * Recovers a previously persisted localized slug map for the product referenced
 * by the current PDP URL. Returns null when not on a PDP or nothing is stored.
 */
export function recoverOtherLocales(): LocalizedProductLocale[] | null {
  if (typeof window === 'undefined') return null

  const skuId = getSkuIdFromPdpPath(globalThis.location.pathname)
  if (!skuId) return null

  try {
    const raw = globalThis.sessionStorage.getItem(
      `${OTHER_LOCALES_STORAGE_PREFIX}${skuId}`
    )

    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isLocalizedProductLocaleArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

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
 * @param otherLocales - Optional list of localized slugs for the current page.
 *   When provided (e.g. on PDP or PLP), the save action navigates to the
 *   localized page URL instead of preserving the current page path verbatim.
 * @param urlSuffix - Suffix appended after the slug when building the redirect URL.
 *   Use '/p' for product pages (default) and '' for collection/PLP pages.
 * @returns Object with languages, currencies, selections, and actions
 */
export function useBindingSelector(
  otherLocales?: Array<{ locale: string; slug: string }> | null,
  urlSuffix = '/p'
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

  // Persist the product's localized slugs so a later locale switch can rebuild
  // the canonical localized URL even from a context-less page (e.g. a 404).
  // Only relevant on PDPs — PLP otherLocales are collection slugs, not products.
  useEffect(() => {
    if (urlSuffix === '/p' && otherLocales?.length) {
      persistOtherLocales(otherLocales)
    }
  }, [otherLocales, urlSuffix])

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

    // Prefer the current page's localized slugs. When missing (e.g. we're on a
    // 404 for a locale where the product is unavailable) recover the map that was
    // persisted while on a working PDP, so we can still build the canonical
    // localized product URL instead of dropping the user on the locale home.
    const effectiveOtherLocales = otherLocales?.length
      ? otherLocales
      : recoverOtherLocales()

    if (effectiveOtherLocales?.length) {
      // 1. Target locale has a specific translation → use it
      const localizedEntry = effectiveOtherLocales.find(
        (e) => e.locale === localeCode
      )

      // 2. No translation for target locale → fall back to the default locale slug
      //    (IS linkText, always in the default locale) to avoid carrying over a
      //    translated slug from a different locale (e.g. Italian slug on es-ES).
      //    For an unavailable target this yields a 404 at the product URL (expected).
      const fallbackEntry = effectiveOtherLocales.find(
        (e) => e.locale === localizationConfig.defaultLocale
      )

      const entry = localizedEntry ?? fallbackEntry

      if (entry) {
        const baseUrl = binding.url.replace(/\/$/, '')
        globalThis.location.href = `${baseUrl}/${entry.slug}${urlSuffix}${globalThis.location.search}${globalThis.location.hash}`
        return
      }
    }

    // otherLocales is empty/null but we're still on a PDP: strip the stale slug.
    if (globalThis.location.pathname.endsWith('/p')) {
      globalThis.location.href = binding.url
      return
    }

    // No localized slugs available (not even persisted): preserve the current
    // page path under the target binding instead of dropping the user on the
    // locale home. For a default-locale slug this resolves the product; for an
    // unavailable/untranslated slug it yields a 404 at the product URL, never the
    // locale root.
    globalThis.location.href = buildRedirectUrl(
      binding.url,
      `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`
    )
  }, [
    localeCode,
    currencyCode,
    localizationConfig.locales,
    localizationConfig.defaultLocale,
    otherLocales,
    urlSuffix,
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
