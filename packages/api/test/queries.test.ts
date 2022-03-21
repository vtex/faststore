import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'

import { getSchema, getContextFactory } from '../src'
import { AllCollectionsQueryFirst5 } from '../mocks/AllCollectionsQuery'
import { AllProductsQueryFirst5 } from '../mocks/AllProductsQuery'
import { CollectionDesksQuery } from '../mocks/CollectionQuery'
import { ProductByIdQuery } from '../mocks/ProductQuery'
import { SearchQueryFirst5Products } from '../mocks/SearchQuery'

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

  expect(response).toMatchSnapshot()
})

test('`product` query', async () => {
  const response = await execute(schema, parse(ProductByIdQuery), null, context)

  expect(response).toMatchSnapshot()
})

test('`search` query', async () => {
  const response = await execute(
    schema,
    parse(SearchQueryFirst5Products),
    null,
    context
  )

  expect(response).toMatchSnapshot()
})

test('`allCollections` query', async () => {
  const response = await execute(
    schema,
    parse(AllCollectionsQueryFirst5),
    null,
    context
  )

  expect(response).toMatchSnapshot()
})

test('`allProducts` query', async () => {
  const response = await execute(
    schema,
    parse(AllProductsQueryFirst5),
    null,
    context
  )

  expect(response).toMatchSnapshot()
})
