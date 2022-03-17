import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'

import { getSchema, getContextFactory } from '../src'
import {
  AllCollectionsFirst5Response,
  AllCollectionsQueryFirst5,
} from '../mocks/AllCollectionsQuery'
import {
  AllProductsFirst5Response,
  AllProductsQueryFirst5,
} from '../mocks/AllProductsQuery'
import {
  CollectionDesksQuery,
  CollectionDesksResponse,
} from '../mocks/CollectionQuery'
import { ProductByIdQuery, ProductByIdResponse } from '../mocks/ProductQuery'
import {
  Search5FirstProductsResponse,
  SearchQueryFirst5Products,
} from '../mocks/SearchQuery'

let schema: GraphQLSchema
let context: Record<string, any>

beforeAll(async () => {
  schema = await getSchema({
    platform: 'vtex',
    account: 'storecomponents',
    environment: 'vtexcommercestable',
    channel: '1',
  })

  const contextFactory = getContextFactory({
    platform: 'vtex',
    account: 'storeframework',
    environment: 'vtexcommercestable',
    channel: '1',
  })

  context = contextFactory({})
})

test('`collection` query', async () => {
  const response = await execute(
    schema,
    parse(CollectionDesksQuery),
    null,
    context
  )

  expect(response).toEqual(CollectionDesksResponse)
})

test('`product` query', async () => {
  const response = await execute(schema, parse(ProductByIdQuery), null, context)

  expect(response).toEqual(ProductByIdResponse)
})

test('`search` query', async () => {
  const response = await execute(
    schema,
    parse(SearchQueryFirst5Products),
    null,
    context
  )

  expect(response).toEqual(Search5FirstProductsResponse)
})

test('`allCollections` query', async () => {
  const response = await execute(
    schema,
    parse(AllCollectionsQueryFirst5),
    null,
    context
  )

  expect(response).toEqual(AllCollectionsFirst5Response)
})

test('`allProducts` query', async () => {
  const response = await execute(
    schema,
    parse(AllProductsQueryFirst5),
    null,
    context
  )

  expect(response).toEqual(AllProductsFirst5Response)
})
