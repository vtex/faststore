import type { APIOptions } from '@faststore/api'
import * as OTELAPI from '@opentelemetry/api'
import storeConfig from '../../discovery.config'
import { version } from '../../package.json' with { type: 'json' }

const OTEL = {}
OTELAPI.propagation.inject(OTELAPI.context.active(), OTEL)

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
  OTEL,
}
