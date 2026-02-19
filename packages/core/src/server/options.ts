import type { APIOptions } from '@faststore/api'
import storeConfig from '../../discovery.config'
import { version } from '../../package.json'

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
    enableUnavailableItemsOnCart:
      storeConfig.api?.enableUnavailableItemsOnCart ?? false,
  },
  version,
  OTEL: {},
}

export async function withTraceClient<T = typeof apiOptions>(
  apiOptions: T
): Promise<T> {
  const OTEL = {}
  const traceCLient = (await import('@faststore/diagnostics'))?.getTraceClient()
  traceCLient?.inject(OTEL)

  return {
    ...apiOptions,
    OTEL,
  } as T
}
