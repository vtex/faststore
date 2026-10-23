import { execute, parse } from 'graphql'

import { getContextFactory, getSchema } from '../src'
import type { Options } from '../src'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  locale: 'en-US',
  hideUnavailableItems: false,
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

jest.mock('../src/platforms/vtex/clients/fetch.ts', () => ({
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
    {
      ...contextFactory({}),
      headers: { 'content-type': 'application/json', cookie: '' },
    },
    variables
  )

const originalEnv = process.env

const withCredentials = () => {
  process.env.FS_NEWSLETTER_APP_KEY = 'newsletter-key'
  process.env.FS_NEWSLETTER_APP_TOKEN = 'newsletter-token'
}

beforeEach(() => {
  mockedFetch.mockReset()
  mockedFetch.mockResolvedValue({ Id: 'NL-1' })
  process.env = { ...originalEnv }
  delete process.env.FS_NEWSLETTER_APP_KEY
  delete process.env.FS_NEWSLETTER_APP_TOKEN
})

afterEach(() => {
  process.env = originalEnv
  jest.restoreAllMocks()
})

const sentRequest = () => {
  const [url, init, options] = mockedFetch.mock.calls[0]

  return { url, init, body: JSON.parse(init.body), options }
}

test('`subscribeToNewsletter` creates the document with a POST authenticated by the newsletter app key', async () => {
  withCredentials()

  const response = await run({
    data: { name: '  Jane  ', email: '  Jane@Example.com ' },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data?.subscribeToNewsletter).toEqual({ id: 'NL-1' })
  expect(mockedFetch).toHaveBeenCalledTimes(1)

  const { url, init, body, options } = sentRequest()

  expect(url).toBe(
    'https://storeframework.vtexcommercestable.com.br/api/dataentities/NL/documents'
  )
  expect(init.method).toBe('POST')
  expect(init.headers['X-VTEX-API-AppKey']).toBe('newsletter-key')
  expect(init.headers['X-VTEX-API-AppToken']).toBe('newsletter-token')
  expect(init.headers.cookie).toBeUndefined()
  expect(options).toBeUndefined()
  expect(body).toEqual({
    name: 'Jane',
    email: 'jane@example.com',
    isNewsletterOptIn: true,
  })
})

test('`subscribeToNewsletter` omits an empty name, as sent when the name input is hidden', async () => {
  withCredentials()

  await run({ data: { name: '', email: 'jane@example.com' } })

  expect(sentRequest().body).toEqual({
    email: 'jane@example.com',
    isNewsletterOptIn: true,
  })
})

// Keep this as the first fallback test: the warning is emitted once per
// process.
test('`subscribeToNewsletter` falls back to the anonymous PATCH without credentials and warns only once', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

  await run({ data: { name: 'Jane', email: 'jane@example.com' } })
  await run({ data: { name: 'John', email: 'john@example.com' } })

  const { url, init } = sentRequest()

  expect(url).toBe(
    'https://storeframework.vtexcommercestable.com.br/api/dataentities/NL/documents/'
  )
  expect(init.method).toBe('PATCH')
  expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()
  expect(warn).toHaveBeenCalledTimes(1)
})

test('`subscribeToNewsletter` does not send the app key of other features', async () => {
  process.env.FS_DISCOVERY_APP_KEY = 'discovery-key'
  process.env.FS_DISCOVERY_APP_TOKEN = 'discovery-token'

  await run({ data: { name: 'Jane', email: 'jane@example.com' } })

  const { init } = sentRequest()

  expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()
  expect(init.headers['X-VTEX-API-AppToken']).toBeUndefined()
})

test.each([
  ['an empty email', ''],
  ['an email without domain', 'jane@'],
  ['an email without TLD', 'jane@example'],
  ['an email with spaces', 'jane doe@example.com'],
  ['an email longer than 254 characters', `${'a'.repeat(250)}@example.com`],
])('`subscribeToNewsletter` rejects %s', async (_, email) => {
  withCredentials()

  const response = await run({ data: { name: 'Jane', email } })

  expect(response.errors?.[0]?.message).toBe('Invalid email')
  expect(mockedFetch).not.toHaveBeenCalled()
})

test('`subscribeToNewsletter` rejects a name longer than 100 characters', async () => {
  withCredentials()

  const response = await run({
    data: { name: 'a'.repeat(101), email: 'jane@example.com' },
  })

  expect(response.errors?.[0]?.message).toMatch(/Invalid name/)
  expect(mockedFetch).not.toHaveBeenCalled()
})
