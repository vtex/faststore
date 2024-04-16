import type { Options as APIOptions } from '@faststore/api'

import storeConfig from '../../faststore.config'

export const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  subDomainPrefix: storeConfig.api.subDomainPrefix ?? ['www'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  incrementAddress: storeConfig.api.incrementAddress,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  flags: {
    enableOrderFormSync: true,
  },
}
