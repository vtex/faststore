import config from 'discovery.config'
import deepEqual from 'fast-deep-equal'
import { useEffect, useState } from 'react'
import { sessionStore } from '../session'
import { matchURLBinding } from './match-url'

type Settings = {
  locale: string
  currency: { code: string; symbol: string }
  salesChannel: string
}

export const useLocalizationConfig = (params?: { url?: string | URL }) => {
  let url = params?.url ?? ''
  const defaultConfig = config.localization.locales[
    config.localization.defaultLocale
  ] as ConfigType
  const defaultBinding =
    defaultConfig.bindings.find((el) => el.isDefault) ??
    defaultConfig.bindings.at(0)

  if (!defaultBinding)
    throw new Error(
      'Localization configuration invalid: not found default binding'
    )

  const [settings, setSettings] = useState<Settings>(
    getSettingsFromConfig(defaultConfig, defaultBinding)
  )

  if (!url) {
    if (typeof window === 'undefined') {
      return settings
    }

    url = window.location.href
  }

  if (url instanceof URL) url = url.toString()

  // @TODO: Check if multilang is enabled and localization is present on config file.
  if (!config.localization) {
    const Err = new Error(
      'Missing localization configuration in faststore config file.'
    )
    console.error(Err)
    throw Err
  }

  const { config: regionConfig, binding } = matchURLBinding(url)
  if (!!regionConfig && !!binding) {
    const newSettings = getSettingsFromConfig(regionConfig, binding)
    if (deepEqual(settings, newSettings) === false) {
      setSettings(newSettings)
    }
  }

  useEffect(() => {
    if (!settings) return

    const session = sessionStore.read()
    console.log('[useLocalizationConfig] Current session before update:', {
      locale: session.locale,
    })

    const channel = JSON.parse(session.channel ?? '{}')
    channel.salesChannel = settings.salesChannel

    const newSession = {
      ...session,
      locale: settings.locale,
      currency: settings.currency,
      channel: JSON.stringify(channel),
    }

    if (
      newSession.channel !== session.channel ||
      newSession.locale !== session.locale ||
      deepEqual(newSession.currency, session.currency) === false
    ) {
      sessionStore.set(newSession)
    }
  }, [settings])

  // Guard: Re-apply binding settings if server overwrites them
  useEffect(() => {
    if (!settings) {
      return
    }

    const unsubscribe = sessionStore.subscribe((updatedSession) => {
      const currentChannel = JSON.parse(updatedSession.channel ?? '{}')

      // Check if localization got overwritten by validateSession
      const localeMatch = updatedSession.locale === settings.locale
      const currencyMatch = deepEqual(
        updatedSession.currency,
        settings.currency
      )
      const channelMatch = currentChannel.salesChannel === settings.salesChannel

      if (!localeMatch || !currencyMatch || !channelMatch) {
        // Re-apply the correct binding settings
        const channel = JSON.parse(updatedSession.channel ?? '{}')
        channel.salesChannel = settings.salesChannel

        sessionStore.set({
          ...updatedSession,
          locale: settings.locale,
          currency: settings.currency,
          channel: JSON.stringify(channel),
        })
      }
    })

    return unsubscribe
  }, [settings])

  function getSettingsFromConfig(
    configObject: ConfigType,
    binding: ConfigType['bindings'][number]
  ): Settings {
    const salesChannel = Number(binding.salesChannel)

    return {
      currency: {
        code: binding.currencyCode,
        symbol: config.localization.currencies[binding.currencyCode].symbol,
      },
      locale: configObject.code,
      salesChannel: String(isNaN(salesChannel) ? 1 : salesChannel),
    }
  }

  return settings
}

type ConfigType =
  (typeof config)['localization']['locales'][keyof (typeof config)['localization']['locales']]
