import { createContext, useContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

export interface LocalizedProductLocale {
  locale: string
  slug: string
}

interface LocalizedProductData {
  /**
   * Localized slug entries for all available locales of the current page.
   * Null when localization is disabled or the page type does not support it.
   */
  otherLocales: LocalizedProductLocale[] | null
  /**
   * Suffix appended after the localized slug when building the redirect URL.
   * Use '/p' for product pages (PDP), '' for collection/PLP pages.
   */
  urlSuffix: string
}

const LocalizedProductContext = createContext<LocalizedProductData | null>(null)

type LocalizedProductProviderProps = Readonly<
  PropsWithChildren<{
    otherLocales: LocalizedProductLocale[] | null | undefined
    /**
     * Suffix to append to the localized slug when building the redirect URL.
     * Defaults to '/p' (product pages). Pass '' for collection/PLP pages.
     */
    urlSuffix?: string
  }>
>

/**
 * Provides localized page data (otherLocales, urlSuffix) to any component in
 * the tree — including global components like LocalizationButton that are
 * not co-located with page sections.
 *
 * Set in p.tsx (PDP) and [...slug].tsx (PLP); returns null outside those pages.
 */
export function LocalizedProductProvider({
  otherLocales,
  urlSuffix = '/p',
  children,
}: LocalizedProductProviderProps) {
  const value = useMemo(
    () => ({ otherLocales: otherLocales ?? null, urlSuffix }),
    [otherLocales, urlSuffix]
  )

  return (
    <LocalizedProductContext.Provider value={value}>
      {children}
    </LocalizedProductContext.Provider>
  )
}

/**
 * Returns localized product data for the current page.
 * Safe to call from any component — returns null outside a product page.
 */
export function useLocalizedProduct(): LocalizedProductData | null {
  return useContext(LocalizedProductContext)
}
