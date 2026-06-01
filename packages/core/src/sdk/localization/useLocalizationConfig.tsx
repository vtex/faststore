import config from 'discovery.config'
import deepEqual from 'fast-deep-equal'
import React, { useEffect, useRef, useState } from 'react'
import { sessionStore } from '../session'
import { type LocalizationSettings, getSettings } from './settings'

export const useLocalizationConfig = (params?: { url?: string | URL }) => {
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

  const [settings, setSettings] = useState<LocalizationSettings>(
    getSettings(params)
  )

  const newSettings = getSettings(params)
  if (deepEqual(settings, newSettings) === false) {
    return setSettings(newSettings)
  }

  // Use a ref to always hold the latest session without causing re-renders or
  // re-running the sync effect. The sync effect only needs to react to `settings`
  // changes, not to every session update triggered by the optimistic middleware.
  const sessionRef = useRef(sessionStore.read() ?? sessionStore.readInitial())

  useEffect(() => {
    return sessionStore.subscribe((newSession) => {
      sessionRef.current = newSession
    })
  }, [])

  useEffect(() => {
    if (!settings) return

    const session = sessionRef.current
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
  }, [settings])

  return settings
}

type ConfigType =
  (typeof config)['localization']['locales'][keyof (typeof config)['localization']['locales']]

export const getStoreURL = () => {
  // If localization is not enabled, use storeUrl from config
  if (!config.localization?.enabled === true) {
    return config.storeUrl
  }

  return getSettings().storeURL
}

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
