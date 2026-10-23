import { execute, parse } from 'graphql'

import type { Options } from '../../src'
import { getContextFactory, getSchema } from '../../src'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  locale: 'en-US',
  subDomainPrefix: ['www'],
  hideUnavailableItems: false,
  incrementAddress: false,
  flags: {
    enableOrderFormSync: true,
  },
} as Options

const SubscribeToNewsletterMutation = `
  mutation SubscribeToNewsletter($data: IPersonNewsletter!) {
    subscribeToNewsletter(data: $data) {
      id
    }
  }
`

const mockedFetch = jest.fn()

jest.mock('../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => mockedFetch(info, init, options),
}))

const schemaPromise = getSchema(apiOptions)
const contextFactory = getContextFactory(apiOptions)

const run = async (variables: Record<string, unknown>) =>
  execute(
    await schemaPromise,
    parse(SubscribeToNewsletterMutation),
    null,
    contextFactory({}),
    variables
  )

const originalEnv = process.env

beforeEach(() => {
  mockedFetch.mockReset()
  mockedFetch.mockResolvedValue({ Id: 'NL-1' })
  process.env = {
    ...originalEnv,
    FS_NEWSLETTER_APP_KEY: 'newsletter-key',
    FS_NEWSLETTER_APP_TOKEN: 'newsletter-token',
  }
})

afterEach(() => {
  process.env = originalEnv
})

const sentBody = () => JSON.parse(mockedFetch.mock.calls[0][1].body)

test('`subscribeToNewsletter` normalizes the input and returns only the created id', async () => {
  const response = await run({
    data: { name: '  Jane  ', email: '  Jane@Example.com ' },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data?.subscribeToNewsletter).toEqual({ id: 'NL-1' })
  expect(sentBody()).toEqual({
    name: 'Jane',
    email: 'jane@example.com',
    isNewsletterOptIn: true,
  })
})

test('`subscribeToNewsletter` omits an empty name, as sent when the name input is hidden', async () => {
  await run({ data: { name: '', email: 'jane@example.com' } })

  expect(sentBody()).toEqual({
    email: 'jane@example.com',
    isNewsletterOptIn: true,
  })
})

test.each([
  ['an empty email', ''],
  ['an email without domain', 'jane@'],
  ['an email without TLD', 'jane@example'],
  ['an email with spaces', 'jane doe@example.com'],
  ['an email longer than 254 characters', `${'a'.repeat(250)}@example.com`],
])('`subscribeToNewsletter` rejects %s', async (_, email) => {
  const response = await run({ data: { name: 'Jane', email } })

  expect(response.errors?.[0]?.message).toBe('Invalid email')
  expect(mockedFetch).not.toHaveBeenCalled()
})

test('`subscribeToNewsletter` rejects a name longer than 100 characters', async () => {
  const response = await run({
    data: { name: 'a'.repeat(101), email: 'jane@example.com' },
  })

  expect(response.errors?.[0]?.message).toMatch(/Invalid name/)
  expect(mockedFetch).not.toHaveBeenCalled()
})
