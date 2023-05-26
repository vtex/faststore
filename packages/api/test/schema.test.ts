import type { GraphQLSchema } from 'graphql'
import { assertValidSchema } from 'graphql'

import { getSchema } from '../src'

const TYPES = [
  'StoreAggregateOffer',
  'StoreAggregateRating',
  'StoreAuthor',
  'StoreBrand',
  'StoreListItem',
  'StoreBreadcrumbList',
  'StoreCartMessage',
  'StoreCart',
  'IStoreCart',
  'StoreCollectionType',
  'StoreCollectionFacet',
  'StoreCollectionMeta',
  'StoreCollection',
  'StoreFacet',
  'StoreFacetRange',
  'StoreFacetBoolean',
  'StoreFacetValueRange',
  'StoreFacetValueBoolean',
  'StoreImage',
  'IStoreImage',
  'StoreOffer',
  'IStoreOffer',
  'StoreOrder',
  'IStoreOrder',
  'StoreOrganization',
  'IStoreOrganization',
  'StorePageInfo',
  'StoreProduct',
  'IStoreProduct',
  'StoreProductGroup',
  'StorePropertyValue',
  'StoreProductEdge',
  'StoreProductConnection',
  'StoreCollectionEdge',
  'StoreCollectionConnection',
  'StoreSort',
  'IStoreSelectedFacet',
  'StoreSearchResult',
  'StoreReviewRating',
  'StoreReview',
  'StoreSeo',
  'StoreStatus',
  'IShippingItem',
  'ShippingData',
  'LogisticsItem',
  'LogisticsInfo',
  'ShippingSLA',
  'DeliveryIds',
  'PickupStoreInfo',
  'PickupAddress',
  'MessageInfo',
  'MessageFields',
]

const QUERIES = [
  'product',
  'collection',
  'search',
  'allProducts',
  'allCollections',
  'shipping',
  'redirect',
  'sellers',
]

const MUTATIONS = ['validateCart', 'validateSession', 'subscribeToNewsletter']

let schema: GraphQLSchema

beforeAll(async () => {
  schema = await getSchema({
    platform: 'vtex',
    account: 'storeframework',
    environment: 'vtexcommercestable',
    channel: '{"salesChannel":"1"}',
    locale: 'en-US',
    hideUnavailableItems: false,
    incrementAddress: false,
    flags: {
      enableOrderFormSync: true,
    },
  })
})

describe('Schema', () => {
  it('should return a valid GraphQL schema for VTEX platform', async () => {
    // `assertValidSchema()` will throw an error if the schema is invalid, and
    // return nothing if it is valid. That's why we're checking for `undefined`.
    expect(assertValidSchema(schema)).toBeUndefined()
  })

  it('should contain all expected types', async () => {
    TYPES.forEach((typeName) => {
      expect(schema.getType(typeName)).toBeDefined()
    })
  })

  it('should contain all default queries', async () => {
    const queryFields = schema.getQueryType()?.getFields() ?? {}

    expect(Object.keys(queryFields)).toEqual(QUERIES)
  })

  it('should contain all default mutations', async () => {
    const mutationFields = schema.getMutationType()?.getFields() ?? {}

    expect(Object.keys(mutationFields)).toEqual(MUTATIONS)
  })
})
