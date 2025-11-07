import { createStore } from '@faststore/sdk'
import type { SettingsResponse } from '@vtex/faststore-sdk'
import { useEffect, useState } from 'react'
import { sessionStore } from './index'

/**
 * Hook to fetch and update session with SDK settings
 * Uses actual browser URL to get accurate locale/currency/URLs
 */

export const useSessionSettings = (settings?: SettingsResponse) => {
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    // Only run once, only in browser
    if (hasFetched || typeof window === 'undefined') {
      console.log('settings', settings)
      return
    }

    const fetchAndUpdateSettings = async () => {
      try {
        // const actualUrl = window.location.href
        const actualUrl = 'https://brandless.myvtex.com/en-EN'

        console.log('useSessionSettings: Fetching settings for URL:', actualUrl)

        // Call API route to get settings for actual URL
        const response = await fetch(
          `/api/settings?url=${encodeURIComponent(actualUrl)}`
        )

        if (!response.ok) {
          console.error('Failed to fetch settings:', response.statusText)
          return
        }

        const freshSettings: SettingsResponse = await response.json()

        console.log('useSessionSettings: Received settings', freshSettings)

        // Update stores with settings
        updateSessionStores(freshSettings)

        setHasFetched(true)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchAndUpdateSettings()
  }, [hasFetched])
}

function updateSessionStores(settings: SettingsResponse) {
  const currentSession = sessionStore.read()

  // Update session store
  const updatedSession = {
    ...currentSession,
    locale: settings.currentLocale || currentSession.locale,
    currency: {
      code: settings.currency || currentSession.currency.code,
      // TODO: Get currency symbol from settings
      symbol: currentSession.currency.symbol,
    },
    channel: JSON.stringify({
      salesChannel:
        settings.salesChannel ||
        JSON.parse(currentSession.channel).salesChannel,
    }),
  }

  sessionStore.set(updatedSession)

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
