import { getClients } from './clients'
import { getLoaders } from './loaders'
import { StoreAggregateOffer } from './resolvers/aggregateOffer'
import { StoreAggregateRating } from './resolvers/aggregateRating'
import { StoreCollection } from './resolvers/collection'
import {
  StoreFacet,
  StoreFacetBoolean,
  StoreFacetRange,
} from './resolvers/facet'
import { StoreFacetValueBoolean } from './resolvers/faceValue'
import { Mutation } from './resolvers/mutation'
import { ObjectOrString } from './resolvers/objectOrString'
import { StoreOffer } from './resolvers/offer'
import { StoreProduct } from './resolvers/product'
import { StoreProductGroup } from './resolvers/productGroup'
import { StorePropertyValue } from './resolvers/propertyValue'
import { Query } from './resolvers/query'
import { StoreReview } from './resolvers/review'
import { StoreSearchResult } from './resolvers/searchResult'
import { StoreSeo } from './resolvers/seo'
import { ShippingSLA } from './resolvers/shippingSLA'
import { SkuVariants } from './resolvers/skuVariations'
import ChannelMarshal from './utils/channel'
import type { Loaders } from './loaders'
import type { Clients } from './clients'
import type { Channel } from './utils/channel'
import type { SearchArgs } from './clients/search'

export interface Options {
  platform: 'vtex'
  account: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
  // Default sales channel to use for fetching products
  channel: string
  locale: string
  hideUnavailableItems: boolean
  incrementAddress: boolean,
  flags?: FeatureFlags
}

interface FeatureFlags {
  enableOrderFormSync?: boolean
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
    channel: Required<Channel>
    locale: string
    flags: FeatureFlags
    searchArgs?: Omit<SearchArgs, 'type'>
  }
  headers: Record<string, string>
}

export type Resolver<R = unknown, A = unknown, Return = any> = (
  root: R,
  args: A,
  ctx: Context,
  info: any
) => Return

const Resolvers = {
  StoreCollection,
  StoreAggregateOffer,
  StoreProduct,
  StoreSeo,
  StoreFacet,
  StoreFacetBoolean,
  StoreFacetRange,
  StoreFacetValueBoolean,
  StoreOffer,
  StoreAggregateRating,
  StoreReview,
  StoreProductGroup,
  StoreSearchResult,
  StorePropertyValue,
  SkuVariants,
  ShippingSLA,
  ObjectOrString,
  Query,
  Mutation,
}

export const getContextFactory =
  (options: Options) =>
    (ctx: any): Context => {
      ctx.storage = {
        channel: ChannelMarshal.parse(options.channel),
        flags: options.flags ?? {},
        locale: options.locale,
      }
      ctx.clients = getClients(options, ctx)
      ctx.loaders = getLoaders(options, ctx)

      return ctx
    }

export const getResolvers = (_: Options) => Resolvers
