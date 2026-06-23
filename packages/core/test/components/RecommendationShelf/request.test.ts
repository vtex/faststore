import { afterEach, describe, expect, it, vi } from 'vitest'

import { request } from 'src/components/RecommendationShelf/queries/request'

type MockResponseInit = {
  ok?: boolean
  status?: number
  contentType?: string | null
  json?: unknown
  text?: string
  jsonThrows?: boolean
}

function mockResponse({
  ok = true,
  status = 200,
  contentType = 'application/json',
  json,
  text,
  jsonThrows = false,
}: MockResponseInit) {
  return {
    ok,
    status,
    headers: { get: () => contentType },
    json: vi.fn(async () => {
      if (jsonThrows) {
        throw new Error('bad json')
      }
      return json
    }),
    text: vi.fn(async () => text ?? ''),
  }
}

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

const queryOp = { __meta__: { operationName: 'FooQuery', operationHash: 'h1' } }
const mutationOp = {
  __meta__: { operationName: 'DoThing', operationHash: 'h2' },
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('request', () => {
  it('returns data for a successful response', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ json: { data: { foo: 'bar' }, errors: [] } })
    )

    const data = await request(queryOp, { a: 1 })

    expect(data).toEqual({ foo: 'bar' })
  })

  it('throws when the GraphQL response has errors', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ json: { data: null, errors: [{ message: 'nope' }] } })
    )

    await expect(request(queryOp, {})).rejects.toThrow('GraphQL error')
  })

  it('uses GET and serializes variables in the query string for *Query operations', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ json: { data: {}, errors: [] } })
    )

    await request(queryOp, { term: 'shoes' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
    expect(url).toContain('operationName=FooQuery')
    expect(url).toContain(encodeURIComponent(JSON.stringify({ term: 'shoes' })))
  })

  it('uses POST with a JSON body for non-query operations', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ json: { data: {}, errors: [] } })
    )

    await request(mutationOp, { id: '1' })

    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toMatchObject({
      operationName: 'DoThing',
      variables: { id: '1' },
    })
  })

  it('honors an explicit method from fetchOptions', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ json: { data: {}, errors: [] } })
    )

    await request(queryOp, {}, { fetchOptions: { method: 'put' } })

    expect(fetchMock.mock.calls[0][1].method).toBe('put')
  })

  it('throws a readable error when JSON parsing fails', async () => {
    fetchMock.mockResolvedValue(mockResponse({ jsonThrows: true }))

    await expect(request(queryOp, {})).rejects.toThrow(
      'Error parsing JSON response'
    )
  })

  it('reads text/plain responses', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ contentType: 'text/plain', text: 'plain body' })
    )

    // text bodies have no `errors`, so the request resolves with the raw body
    await expect(request(queryOp, {})).resolves.toBe(undefined)
  })

  it('throws when the response is not ok', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ ok: false, status: 500, json: { data: null, errors: [] } })
    )

    await expect(request(queryOp, {})).rejects.toThrow('Error while fetching')
  })
})
