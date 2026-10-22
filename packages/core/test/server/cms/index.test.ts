import {
  clientCMS,
  cmsPageCache,
  getCMSPage,
  getPage,
} from '../../../src/server/cms'
import { jest } from '@jest/globals'
import type { ContentData } from '@vtex/client-cms'

describe('CMS Integration', () => {
  const mockData = (count = 1) => {
    const data: ContentData[] = []
    for (let i = 0; i < count; i = i + 1) {
      data.push({
        id: `data-id-${i}`,
        name: `data-name-${i}`,
        status: `data-status-${i}`,
        type: `data-type-${i}`,
        sections: [],
        releaseId: `release-${i}`,
      })
    }
    return data
  }

  const mockListing = (count = 1) => {
    const mockFunction: jest.Mock<typeof clientCMS.getCMSPagesByContentType> =
      jest.fn()
    mockFunction.mockImplementation(() =>
      Promise.resolve({
        data: mockData(count),
        hasNextPage: false,
        totalItems: count,
      })
    )
    return mockFunction
  }

  const mockLocator = () => {
    const mockFunction: jest.Mock<typeof clientCMS.getCMSPage> = jest.fn()
    mockFunction.mockImplementation(() => Promise.resolve(mockData(1)[0]))
    return mockFunction
  }

  beforeEach(() => {
    cmsPageCache.clear()
  })

  describe('getCMSPage', () => {
    it('returns the first page if there is only one page', async () => {
      const mockFunction = mockListing(3)
      clientCMS.getCMSPagesByContentType = mockFunction

      const result = await getCMSPage({ contentType: 'plp' }, clientCMS)

      expect(mockFunction.mock.calls.length).toBe(1)
      expect(result.data.length).toBe(3)
    })

    it('loads multiple pages', async () => {
      const mockFunction: jest.Mock<typeof clientCMS.getCMSPagesByContentType> =
        jest.fn()

      mockFunction.mockImplementationOnce(() => {
        return Promise.resolve({
          data: mockData(10),
          hasNextPage: true,
          totalItems: 15,
        })
      })
      mockFunction.mockImplementationOnce(() => {
        return Promise.resolve({
          data: mockData(5),
          hasNextPage: false,
          totalItems: 15,
        })
      })

      clientCMS.getCMSPagesByContentType = mockFunction

      const result = await getCMSPage({ contentType: 'plp' }, clientCMS)

      expect(mockFunction.mock.calls.length).toBe(2)
      expect(result.data.length).toBe(15)
    })
  })

  describe('cache', () => {
    it('shares a content type listing across concurrent callers', async () => {
      const mockFunction = mockListing(3)
      clientCMS.getCMSPagesByContentType = mockFunction

      await Promise.all([
        getCMSPage({ contentType: 'plp' }),
        getCMSPage({ contentType: 'plp' }),
        getCMSPage({ contentType: 'plp' }),
      ])
      await getCMSPage({ contentType: 'pdp' })

      expect(
        mockFunction.mock.calls.map(([contentType]) => contentType)
      ).toEqual(['plp', 'pdp'])
    })

    it('does not cache filtered listings', async () => {
      const mockFunction = mockListing(1)
      clientCMS.getCMSPagesByContentType = mockFunction
      const options = {
        contentType: 'landingPage',
        filters: { filters: { 'settings.seo.slug': '/summer-sale' } },
      }

      await getCMSPage(options)
      await getCMSPage(options)

      expect(mockFunction).toHaveBeenCalledTimes(2)
    })

    it('fetches a locator on every call by default', async () => {
      const mockFunction = mockLocator()
      clientCMS.getCMSPage = mockFunction
      const locator = {
        contentType: 'globalSections',
        documentId: 'doc-1',
        versionId: 'version-1',
      }

      await getPage(locator)
      await getPage(locator)

      expect(mockFunction).toHaveBeenCalledTimes(2)
    })

    it('reuses a locator fetch when caching is enabled', async () => {
      const mockFunction = mockLocator()
      clientCMS.getCMSPage = mockFunction
      const locator = {
        contentType: 'globalSections',
        documentId: 'doc-1',
        versionId: 'version-1',
      }

      const [first, second] = await Promise.all([
        getPage(locator, { cache: true }),
        getPage(locator, { cache: true }),
      ])
      await getPage({ ...locator, versionId: 'version-2' }, { cache: true })

      expect(first).toEqual(second)
      expect(mockFunction).toHaveBeenCalledTimes(2)
    })

    it('does not cache failures', async () => {
      const error = new Error('Request failed with status code 500')
      const mockFunction: jest.Mock<typeof clientCMS.getCMSPagesByContentType> =
        jest.fn()
      mockFunction
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ data: mockData(1), totalItems: 1 } as never)
      clientCMS.getCMSPagesByContentType = mockFunction

      await expect(getCMSPage({ contentType: 'plp' })).rejects.toBe(error)
      const result = await getCMSPage({ contentType: 'plp' })

      expect(result.data).toHaveLength(1)
      expect(mockFunction).toHaveBeenCalledTimes(2)
    })
  })
})
