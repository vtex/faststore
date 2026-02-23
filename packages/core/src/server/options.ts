import type { APIOptions } from '@faststore/api'
import { getTraceClient } from '@faststore/diagnostics'
import storeConfig from '../../discovery.config'
import pkgJSON from '../../package.json'

const { name, version } = pkgJSON

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
  OTEL: {
    enabled: storeConfig.analytics.otelEnabled,
  },
  discoveryConfig: storeConfig,
}

export async function withTraceClient<T extends APIOptions = typeof apiOptions>(
  apiOptions: T
): Promise<T> {
  const OTEL = {}
  getTraceClient(name)?.inject(OTEL)

  return {
    ...apiOptions,
    OTEL: {
      ...OTEL,
      enabled: storeConfig.analytics?.otelEnabled?.toString() === 'true',
    },
  } as T
}
