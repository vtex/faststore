import { createStore } from '@faststore/sdk'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import localesData from '../../../locales-test.json'
import { sessionStore } from './index'

/**
 * Hook to update session with locale settings from locales.json
 * Matches current URL/locale to get currency and sales channel
 * No API fetch needed - all data comes from prebuild locales.json
 */

/**
 * Build URLs map from locales object
 * Creates a map where each locale has an array of URLs
 */
function buildUrlsMap(locales: any): Record<string, string[]> {
  return Object.keys(locales).reduce(
    (acc, localeCode) => {
      const bindings = locales[localeCode].bindings

      // Handle bindings as array (multiple URLs per locale)
      if (Array.isArray(bindings)) {
        acc[localeCode] = bindings
          .map((binding: any) => binding.url)
          .filter(Boolean)
      }

      return acc
    },
    {} as Record<string, string[]>
  )
}

console.log('url map', buildUrlsMap(localesData.locales))

export const useSessionSettings = () => {
  const [hasInitialized, setHasInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Get current locale from Next.js router
      const currentLocale = router.locale || (localesData as any).defaultLocale

      console.log(localesData)

      console.log('useSessionSettings: Current locale:', currentLocale)

      // Get locale-specific bindings or fallback to defaults
      const localesObj = (localesData as any).locales
      const currenciesObj = (localesData as any).currencies
      const localeConfig = localesObj[currentLocale]

      // Get the first binding (or match by URL in the future)
      const binding = localeConfig?.bindings?.[0]
      const currencyCode = binding?.currencyCode
      const salesChannel = binding?.salesChannel

      // Look up currency details from currencies object
      const currencyInfo = currenciesObj[currencyCode]
      const currencySymbol = currencyInfo?.symbol
      const currencyName = currencyInfo?.name

      // Get settings from locales-test.json
      const settings = {
        currentLocale,
        currency: currencyCode,
        currencySymbol,
        currencyName,
        salesChannel,
        locales: Object.keys(localesObj),
        urls: buildUrlsMap(localesObj),
      }

      console.log(
        'useSessionSettings: Loaded settings from locales.json:',
        settings
      )

      // Update stores with settings
      updateSessionStores(settings)

      if (!hasInitialized) {
        setHasInitialized(true)
      }
    } catch (error) {
      console.error('Error initializing session settings:', error)
    }
  }, [router.locale, hasInitialized])
}

function updateSessionStores(settings: {
  currentLocale: string
  currency: string
  currencySymbol: string
  currencyName: string
  salesChannel: string
  locales: string[]
  urls: Record<string, string[]>
}) {
  const currentSession = sessionStore.read()

  // Update session store
  const updatedSession = {
    ...currentSession,
    locale: settings.currentLocale,
    currency: {
      code: settings.currency,
      symbol: settings.currencySymbol,
    },
    channel: JSON.stringify({
      salesChannel: settings.salesChannel,
    }),
  }

  sessionStore.set(updatedSession)

  console.log('Session updated:', {
    locale: settings.currentLocale,
    currency: settings.currency,
    currencySymbol: settings.currencySymbol,
    currencyName: settings.currencyName,
    salesChannel: settings.salesChannel,
  })

  // Update localization store
  localizationStore.set({
    locales: settings.locales,
    urls: settings.urls,
  })
}

export type LocalizationStore = {
  locales: string[]
  urls: Record<string, string[]>
}

export const localizationStore = createStore<LocalizationStore>(
  {
    locales: [],
    urls: {},
  },
  'fs::localeOptions'
)
