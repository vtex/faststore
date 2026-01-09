import config from 'discovery.config'
import { sessionStore } from '../session'
import { useEffect, useRef, useState } from 'react'
import deepEqual from 'fast-deep-equal'

import { matchURLBinding } from './match-url'

type Settings = {
  locale: string
  currency: { code: string; symbol: string }
  salesChannel: number
}

export const useMultilangConfig = (params?: { url?: string | URL }) => {
  let url = params?.url ?? ''

  const [settings, setSettings] = useState<Settings | undefined>(undefined)

  if (!url) {
    if (typeof window === 'undefined') {
      return undefined
    }

    url = window.location.href
  }

  if (url instanceof URL) url = url.toString()

  // @TODO: Check if multilang is enabled and i18n is present on config file.
  if (!config.i18n) {
    const Err = new Error(
      'Missing i18n configuration in faststore config file.'
    )
    console.error(Err)
    throw Err
  }

  const { config: regionConfig, binding } = matchURLBinding(url)
  if (!!regionConfig && !!binding) {
    const symbol = config.i18n.currencies[binding.currencyCode].symbol

    const newSettings = {
      locale: regionConfig.code,
      currency: {
        symbol,
        code: binding.currencyCode,
      },
      salesChannel: binding.salesChannel,
    }
    if (deepEqual(settings, newSettings) === false) {
      setSettings(newSettings)
    }
  }

  useEffect(() => {
    if (!settings) return

    const session = sessionStore.read()
    session.locale = settings.locale
    session.currency = settings.currency

    const channel = JSON.parse(session.channel ?? '{}')
    channel['salesChannel'] = settings.salesChannel
    session.channel = JSON.stringify(channel)

    const currentSession = sessionStore.read()
    if (
      currentSession.channel !== session.channel ||
      currentSession.locale !== session.locale ||
      deepEqual(currentSession.currency, session.currency)
    ) {
      sessionStore.set(session)
    }
  }, [settings])

  return settings
}
