import type { NextApiRequest, NextApiResponse } from 'next'

import type { SettingsResponse } from '@vtex/faststore-sdk'
import { FastStoreSDK } from '@vtex/faststore-sdk'
import storeConfig from '../../../discovery.config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsResponse>
) {
  try {
    const { url } = req.query

    const account = process.env.VTEX_ACCOUNT
    const appKey = process.env.VTEX_API_KEY
    const appToken = process.env.VTEX_API_TOKEN

    console.log('Initializing FastStoreSDK to get settings:', { account })

    // Use the external FastStoreSDK package
    const faststore = new FastStoreSDK({
      account: account,
      appKey: appKey,
      appToken: appToken,
    })

    // Fetch settings for a specific URL
    const settings = await faststore.settings({
      url: (url as string) || storeConfig.storeUrl,
    })

    console.log('FastStoreSDK settings retrieved:', {
      currentLocale: settings.currentLocale,
      currency: settings.currency,
      salesChannel: settings.salesChannel,
      locales: settings.locales,
    })

    return res.json(settings)
  } catch (error) {
    console.error('Settings API error:', error)

    // Fallback settings for when the FastStoreSDK fails to get the settings
    // TODO: check what to do in this scneario
    const fallbackSettings: SettingsResponse = {
      locales: [],
      currentLocale: storeConfig.session.locale,
      currency: storeConfig.session.currency.code,
      salesChannel: '1',
      currentUrl: storeConfig.storeUrl,
      urls: {},
    }

    return res.json(fallbackSettings)
  }
}
