import { assertValidSchema } from 'graphql'

import { execute, getEnvelop } from '../../src/server'
import {
  getTypeDefsFromFolder,
  getMergedSchema,
} from '../../src/server/generator/schema'
import storeConfig from '../../discovery.config'

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

describe('FastStore GraphQL Layer', () => {
  describe('@faststore/api', () => {
    const nativeSchema = getMergedSchema()

    it('should return a valid GraphQL schema', async () => {
      // `assertValidSchema()` will throw an error if the schema is invalid, and
      // return nothing if it is valid. That's why we're checking for `undefined`.
      expect(assertValidSchema(nativeSchema)).toBeUndefined()
    })

    it('should return a valid GraphQL schema contain all expected types', async () => {
      TYPES.forEach((typeName) => {
        expect(nativeSchema.getType(typeName)).toBeDefined()
      })
    })

    it('should return a valid GraphQL schema contain all expected queries', async () => {
      const queryFields = nativeSchema.getQueryType()?.getFields() ?? {}

      expect(Object.keys(queryFields)).toEqual(QUERIES)
    })

    it('should return a valid GraphQL schema contain all expected mutations', async () => {
      const mutationFields = nativeSchema.getMutationType()?.getFields() ?? {}

      expect(Object.keys(mutationFields)).toEqual(MUTATIONS)
    })
  })

  describe('VTEX API Extension', () => {
    it('getTypeDefsFromFolder function should return an Array', () => {
      const typeDefs = getTypeDefsFromFolder('vtex')
      expect(typeDefs).toBeInstanceOf(Array)
    })
  })

  describe('Third Party API Extension', () => {
    it('getTypeDefsFromFolder function should return an Array', () => {
      const typeDefs = getTypeDefsFromFolder('thirdParty')
      expect(typeDefs).toBeInstanceOf(Array)
    })
  })

  describe('Final Schema after merging', () => {
    it('should return a valid merged GraphQL schema', async () => {
      const schema = getMergedSchema()

      // `assertValidSchema()` will throw an error if the schema is invalid, and
      // return nothing if it is valid. That's why we're checking for `undefined`.
      expect(assertValidSchema(schema)).toBeUndefined()
    })
  })

  describe('Envelop', () => {
    it('should exist with its plugins', async () => {
      const envelop = await getEnvelop()
      expect(envelop).toBeDefined()
      expect(envelop._plugins).toHaveLength(6)
    })

    it('should handle options and execute', async () => {
      const result = await execute({
        variables: { slug: storeConfig.cypress.pages.collection.slice(1) },
        operation: {
          __meta__: {
            operationName: 'ServerCollectionPageQuery',
            operationHash: '4b33c5c07f440dc7489e55619dc2211a13786e72',
          },
        },
      })
      expect(result.data).toBeDefined()
    })
  })
})
