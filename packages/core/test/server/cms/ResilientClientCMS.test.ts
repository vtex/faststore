import ClientCMS from '@vtex/client-cms'
import type { ContentData, ContentPage } from '@vtex/client-cms'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clientCMS, cmsPageCache, getCMSPage } from '../../../src/server/cms'
import {
  CACHE_BUST_PARAM,
  ResilientClientCMS,
} from '../../../src/server/cms/ResilientClientCMS'

const invalidJSON = () =>
  new SyntaxError('Unexpected token \u001f in JSON at position 0')

const contentData = (id: string): ContentData => ({
  id,
  name: id,
  status: 'published',
  type: 'plp',
  sections: [],
  releaseId: '',
})

const listingPage = (
  page: number,
  count: number,
  totalItems: number
): ContentPage => ({
  data: Array.from({ length: count }, (_, i) =>
    contentData(`page-${page}-item-${i}`)
  ),
  hasNextPage: page * 10 < totalItems,
  totalItems,
})

describe('ResilientClientCMS', () => {
  // `ResilientClientCMS#fetch` delegates to the `ClientCMS` implementation,
  // which performs the HTTP request and parses the JSON body.
  let baseFetch: ReturnType<typeof vi.spyOn>
  let warn: ReturnType<typeof vi.spyOn>

  const createClient = () =>
    new ResilientClientCMS({
      tenant: 'store',
      workspace: 'master',
      builder: 'faststore',
      host: 'www.example.com',
    })

  const paramsOfCall = (call: number) =>
    baseFetch.mock.calls[call][1] as URLSearchParams | undefined

  beforeEach(() => {
    cmsPageCache.clear()
    baseFetch = vi.spyOn(ClientCMS.prototype, 'fetch')
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('makes a single request when the response is valid', async () => {
    const page = listingPage(1, 3, 3)
    baseFetch.mockResolvedValueOnce(page)

    const result = await createClient().getCMSPagesByContentType('plp')

    expect(result).toEqual(page)
    expect(baseFetch).toHaveBeenCalledTimes(1)
    expect(paramsOfCall(0)?.has(CACHE_BUST_PARAM)).toBe(false)
    expect(warn).not.toHaveBeenCalled()
  })

  it('retries once bypassing the cache when the body is not valid JSON', async () => {
    const page = listingPage(8, 10, 100)
    baseFetch.mockRejectedValueOnce(invalidJSON()).mockResolvedValueOnce(page)

    const result = await createClient().getCMSPagesByContentType('plp', {
      page: 8,
      perPage: 10,
    })

    expect(result).toEqual(page)
    expect(baseFetch).toHaveBeenCalledTimes(2)

    expect(baseFetch.mock.calls[1][0]).toBe('plp')
    const retryParams = paramsOfCall(1)
    expect(retryParams?.get('page')).toBe('8')
    expect(retryParams?.get('per_page')).toBe('10')
    expect(retryParams?.get(CACHE_BUST_PARAM)).toMatch(/^\d+$/)
    // The original params are not mutated.
    expect(paramsOfCall(0)?.has(CACHE_BUST_PARAM)).toBe(false)

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('plp?page=8&per_page=10')
  })

  it('rejects when the retry is not valid JSON either', async () => {
    baseFetch
      .mockRejectedValueOnce(invalidJSON())
      .mockRejectedValueOnce(invalidJSON())

    await expect(
      createClient().getCMSPagesByContentType('plp')
    ).rejects.toBeInstanceOf(SyntaxError)
    expect(baseFetch).toHaveBeenCalledTimes(2)
  })

  it('handles the invalid-json error raised by node-fetch', async () => {
    const nodeFetchError = Object.assign(
      new Error('invalid json response body'),
      { type: 'invalid-json' }
    )
    const document = contentData('document')
    baseFetch
      .mockRejectedValueOnce(nodeFetchError)
      .mockResolvedValueOnce(document)

    const result = await createClient().getCMSPage({
      contentType: 'landingPage',
      documentId: 'document',
      versionId: 'version',
    })

    expect(result).toEqual(document)
    expect(baseFetch).toHaveBeenCalledTimes(2)
    expect(baseFetch.mock.calls[1][0]).toBe('landingPage/document')
    expect(paramsOfCall(1)?.get('versionId')).toBe('version')
  })

  it('retries when the body is valid JSON but not an object', async () => {
    const page = listingPage(1, 1, 1)
    baseFetch.mockResolvedValueOnce(null).mockResolvedValueOnce(page)

    const result = await createClient().getCMSPagesByContentType('plp')

    expect(result).toEqual(page)
    expect(baseFetch).toHaveBeenCalledTimes(2)
  })

  it('adds the cache-busting param to requests without params', async () => {
    baseFetch
      .mockRejectedValueOnce(invalidJSON())
      .mockResolvedValueOnce({ contentTypes: [{ id: 'plp' }] })

    const result = await createClient().getAllContentTypeIds()

    expect(result).toEqual(['plp'])
    expect(paramsOfCall(1)?.has(CACHE_BUST_PARAM)).toBe(true)
  })

  it('does not retry other errors', async () => {
    const error = new Error('Error while fetching')
    baseFetch.mockRejectedValueOnce(error)

    await expect(createClient().getCMSPagesByContentType('plp')).rejects.toBe(
      error
    )
    expect(baseFetch).toHaveBeenCalledTimes(1)
    expect(warn).not.toHaveBeenCalled()
  })

  it('retries when the body cannot be decoded', async () => {
    // undici's error when `Content-Encoding` does not match the body bytes.
    const decodingError = Object.assign(new TypeError('terminated'), {
      cause: Object.assign(new Error('incorrect header check'), {
        code: 'Z_DATA_ERROR',
      }),
    })
    const page = listingPage(1, 1, 1)
    baseFetch.mockRejectedValueOnce(decodingError).mockResolvedValueOnce(page)

    const result = await createClient().getCMSPagesByContentType('plp')

    expect(result).toEqual(page)
    expect(baseFetch).toHaveBeenCalledTimes(2)
    expect(warn.mock.calls[0][0]).toContain('TypeError: Z_DATA_ERROR')
  })

  it('retries a SyntaxError created in another realm', async () => {
    const foreignSyntaxError = Object.assign(new Error('Unexpected token'), {
      name: 'SyntaxError',
    })
    const page = listingPage(1, 1, 1)
    baseFetch
      .mockRejectedValueOnce(foreignSyntaxError)
      .mockResolvedValueOnce(page)

    const result = await createClient().getCMSPagesByContentType('plp')

    expect(result).toEqual(page)
    expect(baseFetch).toHaveBeenCalledTimes(2)
  })

  it('does not retry a connection reset while reading the body', async () => {
    const error = Object.assign(new TypeError('terminated'), {
      cause: Object.assign(new Error('read ECONNRESET'), {
        code: 'ECONNRESET',
      }),
    })
    baseFetch.mockRejectedValueOnce(error)

    await expect(createClient().getCMSPagesByContentType('plp')).rejects.toBe(
      error
    )
    expect(baseFetch).toHaveBeenCalledTimes(1)
  })

  describe('getCMSPage', () => {
    // Page 1 says there are 25 items, so pages 2 and 3 are fetched in
    // parallel. Page 2 answers with an invalid body the first time.
    const mockListingWithOneBadPage = () => {
      let badResponses = 1

      baseFetch.mockImplementation(async (_path, params) => {
        const page = Number((params as URLSearchParams).get('page'))

        if (page === 2 && badResponses > 0) {
          badResponses -= 1
          throw invalidJSON()
        }

        return listingPage(page, page === 3 ? 5 : 10, 25)
      })
    }

    it('recovers when one page of a listing has an invalid body', async () => {
      mockListingWithOneBadPage()

      const result = await getCMSPage({ contentType: 'plp' }, createClient())

      expect(result.data).toHaveLength(25)
      expect(result.data[10].id).toBe('page-2-item-0')
      // Pages 1, 2 and 3, plus the retry of page 2.
      expect(baseFetch).toHaveBeenCalledTimes(4)
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0][0]).toContain('page=2')
    })

    it('is used by the default CMS client', async () => {
      mockListingWithOneBadPage()

      const result = await getCMSPage({ contentType: 'plp' }, clientCMS)

      expect(clientCMS).toBeInstanceOf(ResilientClientCMS)
      expect(result.data).toHaveLength(25)
      expect(baseFetch).toHaveBeenCalledTimes(4)
    })
  })
})
