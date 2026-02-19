type Platform = 'vtex'

type PromiseType<T> = T extends Promise<infer U> ? U : T

type ArrayElementType<T> = T extends Array<infer U> ? U : T

interface Options {
  platform: 'vtex'
  account: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
  // Default sales channel to use for fetching products
  subDomainPrefix: string[]
  channel: string
  locale: string
  hideUnavailableItems: boolean
  simulationBehavior?: 'default' | 'skip' | 'only1P'
  showSponsored: boolean
  incrementAddress: boolean
  flags?: FeatureFlags
  version?: string
  OTEL?: {
    traceparent?: string
    tracestate?: string
  }
}

interface FeatureFlags {
  enableOrderFormSync?: boolean
  enableUnavailableItemsOnCart?: boolean
}

type Resolver<
  TContext extends Record<string, any>,
  TSource = any,
  TVars = any,
  TReturn = any,
> = (source: TSource, vars: TVars, context: TContext, info: any) => TReturn
