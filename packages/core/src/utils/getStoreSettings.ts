import type { SettingsResponse } from '@vtex/faststore-sdk'
import { FastStoreSDK } from '@vtex/faststore-sdk'

import storeConfig from '../../discovery.config'

export type StoreSettingsResponse = SettingsResponse

const fallbackSettings: SettingsResponse = {
  locales: [],
  currentLocale: storeConfig.session.locale,
  currency: storeConfig.session.currency.code,
  // Missing: currency symbol
  salesChannel: JSON.parse(storeConfig.session.channel).salesChannel,
  currentUrl: storeConfig.storeUrl,
  urls: {},
}

//  Fetch settings from FastStoreSDK
export async function getSDKSettings(url?: string): Promise<SettingsResponse> {
  const account = process.env.VTEX_ACCOUNT || storeConfig.api.storeId
  const appKey = process.env.FS_DISCOVERY_APP_KEY
  const appToken = process.env.FS_DISCOVERY_APP_TOKEN

  if (!account || !appKey || !appToken) {
    console.warn(
      'Missing VTEX environment variables for SDK settings. Falling back to default config.'
    )

    // fallback settings when env vars are not available
    return fallbackSettings
  }

  try {
    const faststore = new FastStoreSDK({
      account,
      appKey,
      appToken,
    })

    const settings = await faststore.settings({
      url: url,
    })

    return settings
  } catch (error) {
    console.error('Failed to fetch SDK settings:', error)

    // Return fallback settings on error
    // TODO: Define another fallback flow - fallback settings or message to the user
    return fallbackSettings
  }
}
