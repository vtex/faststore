import { print } from 'graphql'

import Address from './address.graphql'
import AggregateOffer from './aggregateOffer.graphql'
import AggregateRating from './aggregateRating.graphql'
import Author from './author.graphql'
import Brand from './brand.graphql'
import Breadcrumb from './breadcrumb.graphql'
import Cart from './cart.graphql'
import Collection from './collection.graphql'
import Facet from './facet.graphql'
import Image from './image.graphql'
import Mutation from './mutation.graphql'
import Newsletter from './newsletter.graphql'
import ObjectOrString from './objectOrString.graphql'
import Offer from './offer.graphql'
import Order from './order.graphql'
import Organization from './organization.graphql'
import PageInfo from './pageInfo.graphql'
import Person from './person.graphql'
import Product from './product.graphql'
import ProductGroup from './productGroup.graphql'
import PropertyValue from './propertyValue.graphql'
import Query from './query.graphql'
import Review from './review.graphql'
import Seo from './seo.graphql'
import Session from './session.graphql'
import ShippingSimulation from './shipping.graphql'
import SkuVariants from './skuVariants.graphql'
import Status from './status.graphql'

export const typeDefs = [
  Query,
  Mutation,
  Address,
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
  Order,
  Cart,
  Status,
  PropertyValue,
  Person,
  ObjectOrString,
  Session,
  Newsletter,
  SkuVariants,
  ShippingSimulation,
]
  .map(print)
  .join('\n')
