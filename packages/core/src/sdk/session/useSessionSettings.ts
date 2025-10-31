import { useEffect } from 'react'

import type { SettingsResponse } from '@vtex/faststore-sdk'
import storeConfig from '../../../discovery.config'
import { localizationStore } from '../localization'
import { sessionStore } from './index'

export const useSessionSettings = () => {
  useEffect(() => {
    // Initialize session with settings from FastStoreSDK
    const initializeSession = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const settings: SettingsResponse = await response.json()

          const currentSession = sessionStore.read()

          const channel = currentSession?.channel
            ? JSON.parse(currentSession.channel)
            : { salesChannel: storeConfig.session.channel }

          // Update session with settings from SDK
          sessionStore.set({
            ...currentSession,
            locale: settings.currentLocale,
            currency: {
              ...currentSession?.currency,
              code: settings.currency,
              symbol:
                currentSession?.currency?.symbol ||
                storeConfig.session.currency.symbol,
            },
            channel: JSON.stringify({
              ...channel,
              salesChannel: settings.salesChannel,
            }),
          })

          // Store localization settings (available locales, URL mappings)
          localizationStore.set({
            locales: settings.locales,
            urls: settings.urls,
          })

          console.log('Session initialized with settings:', {
            currentUrl: settings.currentUrl,
            currentLocale: settings.currentLocale,
            currency: settings.currency,
            salesChannel: settings.salesChannel,
            locales: settings.locales,
            urls: settings.urls,
          })
        }
      } catch (error) {
        console.warn('Failed to initialize session with settings:', error)
      }
    }

    initializeSession()
  }, [])
}
