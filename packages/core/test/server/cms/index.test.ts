import { clientCMS, getCMSPage } from '../../../src/server/cms'
import { jest } from '@jest/globals'
import { ContentData } from '@vtex/client-cms'

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

  describe('getCMSPage', () => {
    it('returns the first page if there is only one page', async () => {
      const mockFunction = jest.fn(() => {
        return Promise.resolve({
          data: mockData(3),
          hasNextPage: false,
          totalItems: 3,
        })
      })
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
})
