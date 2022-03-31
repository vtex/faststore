import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'

import type { Options } from '../src'
import { getSchema, getContextFactory } from '../src'
import {
  ValidateCartMutation,
  InvalidCart,
  ValidCart,
} from '../mocks/ValidateCartMutation'

let schema: GraphQLSchema
let context: Record<string, any>

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  hideUnavailableItems: false,
} as Options

beforeAll(async () => {
  schema = await getSchema(apiOptions)

  const contextFactory = getContextFactory(apiOptions)

  context = contextFactory({})
})

test('`validateCart` mutation should return `null` when a valid cart is passed', async () => {
  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: ValidCart }
  )

  expect(response).toEqual({ data: { validateCart: null } })
})

test('`validateCart` mutation should return the full order when an invalid cart is passed', async () => {
  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: InvalidCart }
  )

  expect(response).toMatchSnapshot()
})
