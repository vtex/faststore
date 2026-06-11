import type { APIOptions } from '@faststore/api'
import { getTelemetryClient, OTELAPI } from '@faststore/diagnostics'
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
  // Safe guard in dev mode to prevent the
  // global scope to be erased in hot-module-reload.
  if (process.env.NODE_ENV !== 'production') {
    await getTelemetryClient({
      serviceName: storeConfig.analytics?.serviceName ?? 'faststore',
      version,
      account: storeConfig.api.storeId,
      clientName: storeConfig.api.storeId,
      packageName: name,
    })
  }

  const options = {
    ...apiOptions,
    OTEL: {
      __otelContext: {},
      enabled: true,
    },
  } satisfies T

  const tracer = OTELAPI.trace.getTracer('@faststore/core')
  const span = tracer.startSpan('@faststore/core graphql')

  const context = OTELAPI.trace.setSpan(OTELAPI.context.active(), span)
  OTELAPI.propagation.inject(context, options.OTEL.__otelContext)

  try {
    return options as T
  } catch (error) {
    span?.setStatus({ code: OTELAPI.SpanStatusCode.ERROR })
    span?.recordException(error)
  } finally {
    span?.end()
  }
}
