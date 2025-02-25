import type { Options as APIOptions } from '@faststore/api'

import storeConfig from '../../discovery.config'

export const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  subDomainPrefix: storeConfig.api.subDomainPrefix ?? ['www'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  showSponsored: storeConfig.api.showSponsored,
  simulationBehavior: (storeConfig.api as Record<string, any>)
    .simulationBehavior,
  incrementAddress: storeConfig.api.incrementAddress,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  flags: {
    enableOrderFormSync: true,
  },
}
