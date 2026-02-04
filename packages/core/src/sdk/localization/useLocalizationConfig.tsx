import config from 'discovery.config'
import deepEqual from 'fast-deep-equal'
import React, { useEffect, useState } from 'react'
import { sessionStore } from '../session'
import { matchURLBinding } from './match-url'

type Settings = {
  locale: string
  currency: { code: string; symbol: string }
  salesChannel: string
  storeURL: string
}

export const useLocalizationConfig = (params?: { url?: string | URL }) => {
  const [session, setSession] = useState(
    sessionStore.read() ?? sessionStore.readInitial()
  )
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

  const [settings, setSettings] = useState<Settings>(getSettings(params))

  const newSettings = getSettings(params)
  if (deepEqual(settings, newSettings) === false) {
    return setSettings(newSettings)
  }

  useEffect(() => {
    return sessionStore.subscribe((newSession) => {
      setSession(newSession)
    })
  }, [])

  useEffect(() => {
    if (!settings) return

    const channel = JSON.parse(session.channel ?? '{}') ?? {}
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
  }, [settings, session])

  return settings
}

type ConfigType =
  (typeof config)['localization']['locales'][keyof (typeof config)['localization']['locales']]

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
    salesChannel: isNaN(salesChannel) ? 1 : salesChannel,
    storeURL: binding.url,
  }
}

function getSettings(params?: { url?: string | URL }) {
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

  const defaultSettings = getSettingsFromConfig(defaultConfig, defaultBinding)

  if (!url) {
    if (typeof window === 'undefined') {
      return defaultSettings
    }

    url = window.location.href
  }

  if (url instanceof URL) url = url.toString()

  if (!config.localization) {
    const Err = new Error(
      'Missing localization configuration in faststore config file.'
    )
    console.error(Err)
    throw Err
  }

  const { config: regionConfig, binding } = matchURLBinding(url)
  if (!!regionConfig && !!binding) {
    return getSettingsFromConfig(regionConfig, binding)
  }

  return defaultSettings
}

export const getStoreURL = () => getSettings().storeURL

/** @description receives an react component and returns a new component with the storeURL as optional */
export function withStoreURL<
  Props extends { storeURL: string },
  PartialProps extends Omit<Props, 'storeURL'> & { storeURL?: string },
>(Component: React.ComponentType<Props>): React.ComponentType<PartialProps> {
  return (props: PartialProps) => {
    return React.createElement(Component, {
      ...props,
      storeURL: props.storeURL ?? getStoreURL(),
    } as unknown as Props)
  }
}

export default {
  withStoreURL,
  getStoreURL,
  useLocalizationConfig,
}
