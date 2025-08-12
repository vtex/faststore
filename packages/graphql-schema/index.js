/// <reference types="vite/client" />
Object.defineProperty(exports, '__esModule', { value: true })
exports.typeDefs = exports.mergedTypeDefs = void 0
var graphql_1 = require('graphql')
var merge_1 = require('@graphql-tools/merge')
var graphql_tag_1 = require('graphql-tag')
var address_graphql_raw_1 = require('./typeDefs/address.graphql?raw')
var advertisement_graphql_raw_1 = require('./typeDefs/advertisement.graphql?raw')
var aggregateOffer_graphql_raw_1 = require('./typeDefs/aggregateOffer.graphql?raw')
var aggregateRating_graphql_raw_1 = require('./typeDefs/aggregateRating.graphql?raw')
var author_graphql_raw_1 = require('./typeDefs/author.graphql?raw')
var brand_graphql_raw_1 = require('./typeDefs/brand.graphql?raw')
var breadcrumb_graphql_raw_1 = require('./typeDefs/breadcrumb.graphql?raw')
var cart_graphql_raw_1 = require('./typeDefs/cart.graphql?raw')
var collection_graphql_raw_1 = require('./typeDefs/collection.graphql?raw')
var facet_graphql_raw_1 = require('./typeDefs/facet.graphql?raw')
var image_graphql_raw_1 = require('./typeDefs/image.graphql?raw')
var mutation_graphql_raw_1 = require('./typeDefs/mutation.graphql?raw')
var newsletter_graphql_raw_1 = require('./typeDefs/newsletter.graphql?raw')
var objectOrString_graphql_raw_1 = require('./typeDefs/objectOrString.graphql?raw')
var offer_graphql_raw_1 = require('./typeDefs/offer.graphql?raw')
var order_graphql_raw_1 = require('./typeDefs/order.graphql?raw')
var orderCommercialAuthorizaton_graphql_raw_1 = require('./typeDefs/orderCommercialAuthorizaton.graphql?raw')
var organization_graphql_raw_1 = require('./typeDefs/organization.graphql?raw')
var pageInfo_graphql_raw_1 = require('./typeDefs/pageInfo.graphql?raw')
var password_graphql_raw_1 = require('./typeDefs/password.graphql?raw')
var person_graphql_raw_1 = require('./typeDefs/person.graphql?raw')
var pickupPoints_graphql_raw_1 = require('./typeDefs/pickupPoints.graphql?raw')
var product_graphql_raw_1 = require('./typeDefs/product.graphql?raw')
var productGroup_graphql_raw_1 = require('./typeDefs/productGroup.graphql?raw')
var profile_graphql_raw_1 = require('./typeDefs/profile.graphql?raw')
var propertyValue_graphql_raw_1 = require('./typeDefs/propertyValue.graphql?raw')
var query_graphql_raw_1 = require('./typeDefs/query.graphql?raw')
var review_graphql_raw_1 = require('./typeDefs/review.graphql?raw')
var seo_graphql_raw_1 = require('./typeDefs/seo.graphql?raw')
var session_graphql_raw_1 = require('./typeDefs/session.graphql?raw')
var shipping_graphql_raw_1 = require('./typeDefs/shipping.graphql?raw')
var skuVariants_graphql_raw_1 = require('./typeDefs/skuVariants.graphql?raw')
var status_graphql_raw_1 = require('./typeDefs/status.graphql?raw')
var userOrder_graphql_raw_1 = require('./typeDefs/userOrder.graphql?raw')
var schema = [
  address_graphql_raw_1.default,
  advertisement_graphql_raw_1.default,
  aggregateOffer_graphql_raw_1.default,
  aggregateRating_graphql_raw_1.default,
  author_graphql_raw_1.default,
  brand_graphql_raw_1.default,
  breadcrumb_graphql_raw_1.default,
  cart_graphql_raw_1.default,
  collection_graphql_raw_1.default,
  facet_graphql_raw_1.default,
  image_graphql_raw_1.default,
  mutation_graphql_raw_1.default,
  newsletter_graphql_raw_1.default,
  objectOrString_graphql_raw_1.default,
  offer_graphql_raw_1.default,
  order_graphql_raw_1.default,
  orderCommercialAuthorizaton_graphql_raw_1.default,
  organization_graphql_raw_1.default,
  pageInfo_graphql_raw_1.default,
  password_graphql_raw_1.default,
  person_graphql_raw_1.default,
  pickupPoints_graphql_raw_1.default,
  product_graphql_raw_1.default,
  productGroup_graphql_raw_1.default,
  profile_graphql_raw_1.default,
  propertyValue_graphql_raw_1.default,
  query_graphql_raw_1.default,
  review_graphql_raw_1.default,
  seo_graphql_raw_1.default,
  session_graphql_raw_1.default,
  shipping_graphql_raw_1.default,
  skuVariants_graphql_raw_1.default,
  status_graphql_raw_1.default,
  userOrder_graphql_raw_1.default,
]
var constructSchemaAST = (schema) => (0, graphql_tag_1.default)(schema)
var mergeSchema = (schema, finalSchema) =>
  (0, merge_1.mergeTypeDefs)([finalSchema, schema], { sort: true })
var convertSchemaToString = (AST) => (0, graphql_1.print)(AST)
exports.mergedTypeDefs = schema.map(constructSchemaAST).reduce(mergeSchema)
exports.typeDefs = convertSchemaToString(exports.mergedTypeDefs)
exports.default = exports.typeDefs
