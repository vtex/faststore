import type { GraphqlResolver } from './platforms/vtex'
import type { Options } from './typings/globals'

export * from './__generated__/schema'
export * from './directives'
export {
  stringify as stringifyCacheControl,
  type CacheControl,
} from './directives/cacheControl'
export { GraphqlVtexContextFactory, GraphqlVtexSchema } from './platforms/vtex'
export { typeDefs } from './platforms/vtex/typeDefs'

export * from './platforms/errors'
export type { GraphqlContext, GraphqlResolver } from './platforms/vtex'
export type {
  CommertialOffer,
  Item,
  ProductSearchResult,
  Seller,
} from './platforms/vtex/clients/search/types/ProductSearchResult'
export * from './platforms/vtex/resolvers/root'
export type {
  ArrayElementType,
  FeatureFlags,
  PromiseType,
} from './typings/globals'

export type APIOptions = Options

/**
 * Resolver type for store-side API extensions. Keeps the signature that
 * `@faststore/api@3` exposed publicly (`Resolver<Root, Args, Return>`, with the
 * context fixed to `GraphqlContext`) so existing custom resolvers keep
 * type-checking after upgrading. Equivalent to `GraphqlResolver`.
 */
export type Resolver<
  TRoot = unknown,
  TArgs = unknown,
  TReturn = any,
> = GraphqlResolver<TRoot, TArgs, TReturn>
