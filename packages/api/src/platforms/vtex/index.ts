import { getClients } from './clients'
import { getLoaders } from './loaders'
import { StoreAggregateOffer } from './resolvers/aggregateOffer'
import { StoreAggregateRating } from './resolvers/aggregateRating'
import { StoreCrossSelling } from './resolvers/crossSelling'
import { StoreCollection } from './resolvers/collection'
import { StoreFacet } from './resolvers/facet'
import { StoreFacetValue } from './resolvers/facetValue'
import { Mutation } from './resolvers/mutation'
import { StoreOffer } from './resolvers/offer'
import { StoreProduct } from './resolvers/product'
import { StoreProductGroup } from './resolvers/productGroup'
import { Query } from './resolvers/query'
import { StoreReview } from './resolvers/review'
import { StoreSearchResult } from './resolvers/searchResult'
import { StoreSeo } from './resolvers/seo'
import type { Loaders } from './loaders'
import type { Clients } from './clients'

export interface Options {
  platform: 'vtex'
  account: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
  // Default sales channel to use for fetching products
  channel: string
  hideUnavailableItems: boolean
}

export interface Context {
  clients: Clients
  loaders: Loaders
  /**
   * @description Storage updated at each request.
   *
   * Use this datastructure to store and share small values in the context.
   * Use it with caution since dependecy injection leads to a more complex code
   * */
  storage: {
    channel: string
  }
  headers: Record<string, string>
}

export type Resolver<R = unknown, A = unknown> = (
  root: R,
  args: A,
  ctx: Context,
  info: any
) => any

const Resolvers = {
  StoreCollection,
  StoreCrossSelling,
  StoreAggregateOffer,
  StoreProduct,
  StoreSeo,
  StoreFacet,
  StoreFacetValue,
  StoreOffer,
  StoreAggregateRating,
  StoreReview,
  StoreProductGroup,
  StoreSearchResult,
  Query,
  Mutation,
}

export const getContextFactory = (options: Options) => (ctx: any) => {
  ctx.storage = {
    channel: options.channel,
  }
  ctx.clients = getClients(options, ctx)
  ctx.loaders = getLoaders(options, ctx)

  return ctx
}

export const getResolvers = (_: Options) => Resolvers
