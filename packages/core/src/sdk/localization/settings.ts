import config from 'discovery.config'
import { matchURLBinding } from './match-url'

export type LocalizationSettings = {
  locale: string
  currency: { code: string; symbol: string }
  salesChannel: string
  storeURL: string
}

type ConfigType =
  (typeof config)['localization']['locales'][keyof (typeof config)['localization']['locales']]

export function getSettingsFromConfig(
  configObject: ConfigType,
  binding: ConfigType['bindings'][number]
): LocalizationSettings {
  const salesChannel = Number(binding.salesChannel)

  return {
    currency: {
      code: binding.currencyCode,
      symbol: config.localization.currencies[binding.currencyCode].symbol,
    },
    locale: configObject.code,
    salesChannel: `${Number.isNaN(salesChannel) ? 1 : salesChannel}`,
    storeURL: binding.url,
  }
}

/**
 * Resolves a locale's settings from configuration alone, without a request URL.
 *
 * Statically rendered pages have no request to match a binding against, so
 * `getSettings` falls back to the default locale on the server and every
 * server-rendered URL ends up describing the default locale rather than the page
 * being built. Next resolves the locale for us during rendering, and this maps
 * it back to a binding.
 *
 * The binding tie-break matches the rest of the localization layer (see
 * `getChannelForLocale`): the one marked default, else the first declared.
 * Returns null when the locale is unknown or has no usable binding, leaving the
 * caller on its existing fallback.
 */
export function getSettingsForLocale(
  locale?: string
): LocalizationSettings | null {
  if (!locale || !config.localization?.enabled) return null

  const localeConfig = config.localization.locales?.[locale]

  if (!localeConfig) return null

  const binding =
    localeConfig.bindings?.find((el) => el.isDefault) ??
    localeConfig.bindings?.at(0)

  if (!binding) return null

  return getSettingsFromConfig(localeConfig, binding)
}

export function getSettings(params?: {
  url?: string | URL
}): LocalizationSettings {
  if (!config.localization) {
    const err = new Error(
      'Missing localization configuration in faststore config file.'
    )
    console.error(err)
    throw err
  }

  let url = params?.url ?? ''
  const defaultConfig =
    config.localization.locales[config.localization.defaultLocale]

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

  const { config: regionConfig, binding } = matchURLBinding(url)
  if (!!regionConfig && !!binding) {
    return getSettingsFromConfig(regionConfig, binding)
  }

  return defaultSettings
}
