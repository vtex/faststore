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
