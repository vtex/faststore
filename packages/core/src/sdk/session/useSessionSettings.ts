import type { SettingsResponse } from '@vtex/faststore-sdk'
import { useEffect } from 'react'

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

    // Only update if values changed
    if (JSON.stringify(updatedSession) !== JSON.stringify(currentSession)) {
      sessionStore.set(updatedSession)
    }
  }, [settings])
}
