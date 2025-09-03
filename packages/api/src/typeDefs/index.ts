/// <reference types="vite/client" />

import { type DocumentNode, print } from 'graphql'
import { mergeTypeDefs } from '@graphql-tools/merge'
import gql from 'graphql-tag'

import Address from './address.graphql?raw'
import Advertisement from './advertisement.graphql?raw'
import AggregateOffer from './aggregateOffer.graphql?raw'
import AggregateRating from './aggregateRating.graphql?raw'
import Author from './author.graphql?raw'
import Brand from './brand.graphql?raw'
import Breadcrumb from './breadcrumb.graphql?raw'
import Cart from './cart.graphql?raw'
import Collection from './collection.graphql?raw'
import Facet from './facet.graphql?raw'
import Image from './image.graphql?raw'
import Mutation from './mutation.graphql?raw'
import Newsletter from './newsletter.graphql?raw'
import ObjectOrString from './objectOrString.graphql?raw'
import Offer from './offer.graphql?raw'
import Order from './order.graphql?raw'
import OrderCommercialAuthorizaton from './orderCommercialAuthorizaton.graphql?raw'
import Organization from './organization.graphql?raw'
import PageInfo from './pageInfo.graphql?raw'
import Password from './password.graphql?raw'
import Person from './person.graphql?raw'
import PickupPoints from './pickupPoints.graphql?raw'
import Product from './product.graphql?raw'
import ProductGroup from './productGroup.graphql?raw'
import Profile from './profile.graphql?raw'
import PropertyValue from './propertyValue.graphql?raw'
import Query from './query.graphql?raw'
import Review from './review.graphql?raw'
import Seo from './seo.graphql?raw'
import Session from './session.graphql?raw'
import Shipping from './shipping.graphql?raw'
import SkuVariants from './skuVariants.graphql?raw'
import Status from './status.graphql?raw'
import UserOrder from './userOrder.graphql?raw'

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
