import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'

import { getSchema, getContextFactory } from '../src'
import {
  ValidateCartMutationCompleteOrderResponse,
  ValidateCartMutation,
  InvalidCart,
  ValidCart,
} from '../mocks/ValidateCartMutation'

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

test('`validateCart` mutation, returning `null`', async () => {
  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: ValidCart }
  )

  expect(response).toEqual({ data: { validateCart: null } })
})

test('`validateCart` mutation, returning full order', async () => {
  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: InvalidCart }
  )

  expect(response).toEqual(ValidateCartMutationCompleteOrderResponse)
})
