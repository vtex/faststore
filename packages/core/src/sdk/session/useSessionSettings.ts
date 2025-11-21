import { createStore } from '@faststore/sdk'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import localesData from '../../../locales-test.json'
import { sessionStore } from './index'

/**
 * Hook to update session with locale settings from locales.json
 * Matches current URL/locale to get currency and sales channel
 * No API fetch needed - all data comes from prebuild locales.json
 */

/**
 * Build URLs map from locales object
 */
function buildUrlsMap(locales: any): Record<string, string> {
  return Object.keys(locales).reduce(
    (acc, localeCode) => {
      acc[localeCode] = locales[localeCode].bindings.url
      return acc
    },
    {} as Record<string, string>
  )
}

console.log('url map', buildUrlsMap(localesData.locales))

export const useSessionSettings = () => {
  const router = useRouter()
  const prevLocaleRef = useRef<string>()

  // Get current locale from Next.js router
  const currentLocale = router.locale || (localesData as any).defaultLocale

  // Initialize/update stores synchronously when locale changes
  // This prevents blink on first render and locale switches
  if (
    typeof window !== 'undefined' &&
    prevLocaleRef.current !== currentLocale
  ) {
    try {
      prevLocaleRef.current = currentLocale

      console.log('useSessionSettings: Current locale:', currentLocale)

      // Get locale-specific bindings or fallback to defaults
      const localesObj = (localesData as any).locales
      const localeConfig = localesObj[currentLocale]
      const currency = localeConfig?.bindings?.currency?.code
      const currencySymbol = localeConfig?.bindings?.currency?.symbol
      const salesChannel = localeConfig?.bindings?.salesChannel

      // Get settings from locales-test.json
      const settings = {
        currentLocale,
        currency,
        currencySymbol,
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
    } catch (error) {
      console.error('Error initializing session settings:', error)
    }
  }
}

function updateSessionStores(settings: {
  currentLocale: string
  currency: string
  currencySymbol: string
  salesChannel: string
  locales: string[]
  urls: Record<string, string>
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
  urls: Record<string, string>
}

export const localizationStore = createStore<LocalizationStore>(
  {
    locales: [],
    urls: {},
  },
  'fs::localeOptions'
)
