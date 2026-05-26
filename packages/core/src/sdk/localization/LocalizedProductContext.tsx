import { createContext, useContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

export interface LocalizedProductLocale {
  locale: string
  slug: string
}

interface LocalizedProductData {
  /**
   * Localized slug entries for all available locales of the current product.
   * Null when not on a product page or when localization is disabled.
   */
  otherLocales: LocalizedProductLocale[] | null
}

const LocalizedProductContext = createContext<LocalizedProductData | null>(null)

interface LocalizedProductProviderProps extends PropsWithChildren {
  otherLocales: LocalizedProductLocale[] | null | undefined
}

/**
 * Provides localized product data (e.g. otherLocales) to any component in
 * the tree — including global components like LocalizationButton that are
 * not co-located with the PDP sections.
 *
 * Set in p.tsx; returns null outside a product page.
 */
export function LocalizedProductProvider({
  otherLocales,
  children,
}: LocalizedProductProviderProps) {
  const value = useMemo(
    () => ({ otherLocales: otherLocales ?? null }),
    [otherLocales]
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
