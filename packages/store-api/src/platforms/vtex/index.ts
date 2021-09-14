import { StoreSearchResult } from './resolvers/searchResult'
import { getClients } from './clients'
import { StoreAggregateOffer } from './resolvers/aggregateOffer'
import { StoreAggregateRating } from './resolvers/aggregateRating'
import { StoreCollection } from './resolvers/collection'
import { StoreFacet } from './resolvers/facet'
import { StoreFacetValue } from './resolvers/facetValue'
import { StoreOffer } from './resolvers/offer'
import { StoreProduct } from './resolvers/product'
import { StoreProductGroup } from './resolvers/productGroup'
import { Query } from './resolvers/query'
import { StoreReview } from './resolvers/review'
import { StoreSeo } from './resolvers/seo'
import type { Clients } from './clients'

export interface Options {
  platform: 'vtex'
  account: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
}

export interface Context {
  clients: Clients
}

export type Resolver<R = unknown, A = unknown> = (
  root: R,
  args: A,
  ctx: Context,
  info: any
) => any

const Resolvers = {
  StoreCollection,
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
}

export const getContextFactory = (options: Options) => (ctx: any) => {
  ctx.clients = getClients(options)

  return ctx
}

export const getResolvers = (_: Options) => Resolvers
