/// <reference types="vite/client" />

import { type DocumentNode, print } from 'graphql'
import { mergeTypeDefs } from '@graphql-tools/merge'
import gql from 'graphql-tag'

import Address from './typeDefs/address.graphql?raw'
import Advertisement from './typeDefs/advertisement.graphql?raw'
import AggregateOffer from './typeDefs/aggregateOffer.graphql?raw'
import AggregateRating from './typeDefs/aggregateRating.graphql?raw'
import Author from './typeDefs/author.graphql?raw'
import Brand from './typeDefs/brand.graphql?raw'
import Breadcrumb from './typeDefs/breadcrumb.graphql?raw'
import Cart from './typeDefs/cart.graphql?raw'
import Collection from './typeDefs/collection.graphql?raw'
import Facet from './typeDefs/facet.graphql?raw'
import Image from './typeDefs/image.graphql?raw'
import Mutation from './typeDefs/mutation.graphql?raw'
import Newsletter from './typeDefs/newsletter.graphql?raw'
import ObjectOrString from './typeDefs/objectOrString.graphql?raw'
import Offer from './typeDefs/offer.graphql?raw'
import Order from './typeDefs/order.graphql?raw'
import OrderCommercialAuthorizaton from './typeDefs/orderCommercialAuthorizaton.graphql?raw'
import Organization from './typeDefs/organization.graphql?raw'
import PageInfo from './typeDefs/pageInfo.graphql?raw'
import Password from './typeDefs/password.graphql?raw'
import Person from './typeDefs/person.graphql?raw'
import PickupPoints from './typeDefs/pickupPoints.graphql?raw'
import Product from './typeDefs/product.graphql?raw'
import ProductGroup from './typeDefs/productGroup.graphql?raw'
import Profile from './typeDefs/profile.graphql?raw'
import PropertyValue from './typeDefs/propertyValue.graphql?raw'
import Query from './typeDefs/query.graphql?raw'
import Review from './typeDefs/review.graphql?raw'
import Seo from './typeDefs/seo.graphql?raw'
import Session from './typeDefs/session.graphql?raw'
import Shipping from './typeDefs/shipping.graphql?raw'
import SkuVariants from './typeDefs/skuVariants.graphql?raw'
import Status from './typeDefs/status.graphql?raw'
import UserOrder from './typeDefs/userOrder.graphql?raw'

const schema = [
  Address,
  Advertisement,
  AggregateOffer,
  AggregateRating,
  Author,
  Brand,
  Breadcrumb,
  Cart,
  Collection,
  Facet,
  Image,
  Mutation,
  Newsletter,
  ObjectOrString,
  Offer,
  Order,
  OrderCommercialAuthorizaton,
  Organization,
  PageInfo,
  Password,
  Person,
  PickupPoints,
  Product,
  ProductGroup,
  Profile,
  PropertyValue,
  Query,
  Review,
  Seo,
  Session,
  Shipping,
  SkuVariants,
  Status,
  UserOrder,
]

const constructSchemaAST = (schema: string) => gql(schema)
const mergeSchema = (schema: DocumentNode, finalSchema: DocumentNode) =>
  mergeTypeDefs([finalSchema, schema], { sort: true })
const convertSchemaToString = (AST: DocumentNode) => print(AST)

export const mergedTypeDefs = schema.map(constructSchemaAST).reduce(mergeSchema)

export const typeDefs = convertSchemaToString(mergedTypeDefs)

export default typeDefs
