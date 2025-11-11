import { StoreAggregateOffer } from './aggregateOffer'
import { StoreAggregateRating } from './aggregateRating'
import { StoreCollection } from './collection'
import { StoreFacet, StoreFacetBoolean, StoreFacetRange } from './facet'
import { StoreFacetValueBoolean } from './faceValue'
import { Mutation } from './mutation'
import { ObjectOrString } from './objectOrString'
import { StoreOffer } from './offer'
import { StoreProduct } from './product'
import { StoreProductGroup } from './productGroup'
import { StorePropertyValue } from './propertyValue'
import { Query } from './query'
import { StoreReview } from './review'
import { StoreSearchResult } from './searchResult'
import { StoreSeo } from './seo'
import { ShippingSLA } from './shippingSLA'
import { SkuVariants } from './skuVariations'
import { UserOrderResult } from './userOrder'

const VtexResolvers = {
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
  UserOrderResult,
  ObjectOrString,
  Query,
  Mutation,
}

export const getResolvers = () => VtexResolvers
