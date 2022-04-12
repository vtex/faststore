import { print } from 'graphql'

import ProductSpecificationGroup from  './productSpecificationGroup.graphql'
import AggregateOffer from './aggregateOffer.graphql'
import AggregateRating from './aggregateRating.graphql'
import Author from './author.graphql'
import Brand from './brand.graphql'
import Breadcrumb from './breadcrumb.graphql'
import BundleItem from './bundleItem.graphql'
import Collection from './collection.graphql'
import Facet from './facet.graphql'
import Image from './image.graphql'
import Mutation from './mutation.graphql'
import Offer from './offer.graphql'
import Offerings from './offerings.graphql'
import Order from './order.graphql'
import Organization from './organization.graphql'
import PageInfo from './pageInfo.graphql'
import Product from './product.graphql'
import ProductGroup from './productGroup.graphql'
import Query from './query.graphql'
import Review from './review.graphql'
import Seo from './seo.graphql'
import Cart from './cart.graphql'
import Status from './status.graphql'
import PropertyValue from './propertyValue.graphql'
import Person from './person.graphql'

export const typeDefs = [
  Query,
  Mutation,
  Brand,
  Breadcrumb,
  Collection,
  Facet,
  Image,
  PageInfo,
  Product,
  Seo,
  Offer,
  Offerings,
  AggregateRating,
  Review,
  Author,
  ProductGroup,
  Organization,
  AggregateOffer,
  Order,
  Cart,
  Status,
  PropertyValue,
  Person,
  BundleItem,
  ProductSpecificationGroup
]
  .map(print)
  .join('\n')
