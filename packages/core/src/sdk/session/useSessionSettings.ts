import type { SettingsResponse } from '@vtex/faststore-sdk'
import { useEffect } from 'react'

import { createStore } from '@faststore/sdk'
import { sessionStore } from './index'

/**
 * Hook to initialize/update session from SDK settings
 *
 * This hook takes settings fetched from FastStoreSDK (in getStaticProps)
 * and updates the session store with locale, currency, and sales channel.
 */

export const useSessionSettings = (settings?: SettingsResponse) => {
  useEffect(() => {
    if (!settings) {
      console.warn('useSessionSettings: No settings provided')
      return
    }

    console.log('useSessionSettings: Updating session with settings', settings)

    const currentSession = sessionStore.read()

    // Update session with sdk settings
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

    localizationStore.set({
      locales: settings.locales,
      urls: settings.urls,
    })

    sessionStore.set(updatedSession)
  }, [settings])
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
