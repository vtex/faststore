/**
 * Shared helper types for the API package.
 *
 * These used to be ambient (script-scoped) declarations. Ambient types are not
 * reachable from the published `index.d.ts`, so consumers importing
 * `GraphqlResolver`/`APIOptions` saw them degrade to implicit `any`. Keeping
 * this file a real module (explicit `export`s) makes the emitted typings
 * self-contained.
 */

export type Platform = 'vtex'

export type PromiseType<T> = T extends Promise<infer U> ? U : T

export type ArrayElementType<T> = T extends Array<infer U> ? U : T

export interface Options {
  platform: Platform
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
  discoveryConfig?: Record<string, unknown>
  /** Emit OpenTelemetry spans from resolvers. Defaults to disabled. */
  OTEL_ENABLED?: boolean
}

export interface FeatureFlags {
  enableOrderFormSync?: boolean
  enableUnavailableItemsOnCart?: boolean
}

export type Resolver<
  TContext extends Record<string, any>,
  TSource = any,
  TVars = any,
  TReturn = any,
> = (source: TSource, vars: TVars, context: TContext, info: any) => TReturn
