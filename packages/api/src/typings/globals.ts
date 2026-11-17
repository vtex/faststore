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
  /**
   * Maps additional `StoreSort` enum values (added to the schema via a
   * project-level `extend enum StoreSort { ... }`) to the Intelligent Search
   * `sort=` query string, e.g. `{ rating_desc: 'Rating:desc' }`. Merged ahead
   * of the built-in sort map, so a key here can also override a default sort.
   */
  customSortMap?: Record<string, string>
  version?: string
  discoveryConfig?: Record<string, unknown>
  /** Emit OpenTelemetry spans from resolvers. Defaults to disabled. */
  OTEL_ENABLED?: boolean
}

export interface FeatureFlags {
  enableOrderFormSync?: boolean
  enableUnavailableItemsOnCart?: boolean
  /**
   * Keep every Checkout cart line as its own FastStore cart line, matched by
   * the line's `uniqueId`. Use it when Checkout keeps units of one SKU apart
   * (manual `/split`, assembly options) before they differ in attachments or
   * services. Off by default: lines are then merged by SKU, seller,
   * attachments and services, which also merges promotion splits.
   */
  preserveCartLines?: boolean
}

export type Resolver<
  TContext extends Record<string, any>,
  TSource = any,
  TVars = any,
  TReturn = any,
> = (source: TSource, vars: TVars, context: TContext, info: any) => TReturn
