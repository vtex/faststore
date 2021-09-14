import { print } from 'graphql'

import AggregateOffer from './aggregateOffer.graphql'
import AggregateRating from './aggregateRating.graphql'
import Author from './author.graphql'
import Brand from './brand.graphql'
import Breadcrumb from './breadcrumb.graphql'
import Collection from './collection.graphql'
import Facet from './facet.graphql'
import Image from './image.graphql'
import Offer from './offer.graphql'
import Organization from './organization.graphql'
import PageInfo from './pageInfo.graphql'
import Product from './product.graphql'
import ProductGroup from './productGroup.graphql'
import Query from './query.graphql'
import Review from './review.graphql'
import Seo from './seo.graphql'

export const typeDefs = [
  Query,
  Brand,
  Breadcrumb,
  Collection,
  Facet,
  Image,
  PageInfo,
  Product,
  Seo,
  Offer,
  AggregateRating,
  Review,
  Author,
  ProductGroup,
  Organization,
  AggregateOffer,
]
  .map(print)
  .join('\n')
