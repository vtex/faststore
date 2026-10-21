import type { ContentEntry, EntryPathParams } from '@vtex/client-cp'

import { ContentService } from '../../../src/server/content/service'
import type { ContentParams } from '../../../src/server/content/types'

jest.mock('../../../src/server/content/utils', () => ({
  ...jest.requireActual('../../../src/server/content/utils'),
  isContentPlatformSource: jest.fn(() => true),
}))

const NOT_FOUND = 'Request failed with status code 404'
const FIVE_MINUTES = 5 * 60 * 1000

const entryData: Record<string, Record<string, unknown>> = {
  generic: { sections: [{ name: 'Generic' }] },
  collection: {
    settings: { template: { value: '/colecao' } },
    sections: [{ name: 'Collection' }],
  },
  other: {
    settings: { template: { value: '/outra' } },
    sections: [{ name: 'Other' }],
  },
}

const toEntry = (id: string) => ({ id, name: id }) as ContentEntry

function createFakeClientCP(pages: string[][]) {
  return {
    listEntries: jest.fn(async (_params: EntryPathParams, scroll?: string) => {
      const index = scroll ? Number(scroll) : 0
      return {
        entries: pages[index].map(toEntry),
        scroll: index + 1 < pages.length ? String(index + 1) : null,
      }
    }),
    getEntry: jest.fn(async ({ entryId }: EntryPathParams) => ({
      ...entryData[entryId as string],
    })),
    previewEntryById: jest.fn(async ({ entryId }: EntryPathParams) => ({
      ...entryData[entryId as string],
    })),
    getEntryBySlug: jest.fn(
      async (_params: EntryPathParams): Promise<Record<string, unknown>> => {
        throw new Error(NOT_FOUND)
      }
    ),
    previewEntryBySlug: jest.fn(
      async (_params: EntryPathParams): Promise<Record<string, unknown>> => {
        throw new Error(NOT_FOUND)
      }
    ),
  }
}

function createServiceWithClient(
  pages: string[][] = [['generic', 'collection', 'other']]
) {
  const service = new ContentService()
  const clientCP = createFakeClientCP(pages)
  Object.defineProperty(service, 'clientCP', { value: clientCP })
  return { service, clientCP }
}

describe('ContentService Content Platform template list cache', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('shares one list and entry fetch across concurrent PLPs with different slugs', async () => {
    const { service, clientCP } = createServiceWithClient()

    const [collectionPage, otherPage, unknownPage] = await Promise.all([
      service.getPlpContent({ slug: 'colecao/camisetas' }, []),
      service.getPlpContent({ slug: 'outra' }, []),
      service.getPlpContent({ slug: 'nao-existe' }, []),
    ])

    expect(clientCP.listEntries).toHaveBeenCalledTimes(1)
    expect(clientCP.getEntry).toHaveBeenCalledTimes(3)
    expect(collectionPage.sections).toEqual([{ name: 'Collection' }])
    expect(otherPage.sections).toEqual([{ name: 'Other' }])
    expect(unknownPage.sections).toEqual([{ name: 'Generic' }])
  })

  it('reuses the cached list within the TTL', async () => {
    const { service, clientCP } = createServiceWithClient()

    await service.getPlpContent({ slug: 'colecao' }, [])
    await service.getPlpContent({ slug: 'outra' }, [])

    expect(clientCP.listEntries).toHaveBeenCalledTimes(1)
    expect(clientCP.getEntry).toHaveBeenCalledTimes(3)
  })

  it('still prefers a direct slug match over the cached list', async () => {
    const { service, clientCP } = createServiceWithClient()
    await service.getPlpContent({ slug: 'colecao' }, [])

    clientCP.getEntryBySlug.mockResolvedValueOnce({
      sections: [{ name: 'Direct' }],
    })
    const page = await service.getPlpContent({ slug: 'colecao' }, [])

    expect(page.sections).toEqual([{ name: 'Direct' }])
    expect(clientCP.listEntries).toHaveBeenCalledTimes(1)
  })

  it('consumes every scroll page once', async () => {
    const { service, clientCP } = createServiceWithClient([
      ['generic'],
      ['collection'],
      ['other'],
    ])

    await Promise.all([
      service.getMultipleContent({ contentType: 'plp' }),
      service.getMultipleContent({ contentType: 'plp' }),
    ])
    const { data } = await service.getMultipleContent({ contentType: 'plp' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(3)
    expect(clientCP.listEntries.mock.calls.map(([, scroll]) => scroll)).toEqual(
      [undefined, '1', '2']
    )
    expect(data.map((entry) => entry.id)).toEqual([
      'generic',
      'collection',
      'other',
    ])
  })

  it('keeps separate entries per content type', async () => {
    const { service, clientCP } = createServiceWithClient()

    await service.getMultipleContent({ contentType: 'plp' })
    await service.getMultipleContent({ contentType: 'pdp' })
    await service.getMultipleContent({ contentType: 'pdp' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
    expect(
      clientCP.listEntries.mock.calls.map(([params]) => params.contentType)
    ).toEqual(['plp', 'pdp'])
  })

  it('bypasses the cache for previews', async () => {
    const { service, clientCP } = createServiceWithClient()
    const previewParams: ContentParams = {
      contentType: 'plp',
      previewData: {
        contentType: 'plp',
        documentId: 'collection',
        versionId: 'version-1',
      },
    }

    await service.getMultipleContent({ contentType: 'plp' })
    await service.getMultipleContent(previewParams)
    await service.getMultipleContent(previewParams)
    await service.getMultipleContent({ contentType: 'plp' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(3)
    expect(clientCP.getEntry).toHaveBeenCalledTimes(3)
    expect(clientCP.previewEntryById).toHaveBeenCalledTimes(6)
  })

  it('does not cache failures', async () => {
    const { service, clientCP } = createServiceWithClient()
    const error = new Error('Request failed with status code 500')
    clientCP.listEntries.mockRejectedValueOnce(error)

    await expect(
      service.getMultipleContent({ contentType: 'plp' })
    ).rejects.toBe(error)
    const { data } = await service.getMultipleContent({ contentType: 'plp' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
    expect(data).toHaveLength(3)
  })

  it('does not let a late failure evict a newer fetch', async () => {
    jest.useFakeTimers()
    const { service, clientCP } = createServiceWithClient()
    let rejectFirst: (err: Error) => void = () => {}
    clientCP.listEntries.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectFirst = reject
        })
    )

    const first = service.getMultipleContent({ contentType: 'plp' })
    const firstResult = expect(first).rejects.toThrow('late failure')
    jest.advanceTimersByTime(FIVE_MINUTES)
    await service.getMultipleContent({ contentType: 'plp' })

    rejectFirst(new Error('late failure'))
    await firstResult
    await service.getMultipleContent({ contentType: 'plp' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })

  it('fetches the list again after the TTL', async () => {
    jest.useFakeTimers()
    const { service, clientCP } = createServiceWithClient()

    await service.getMultipleContent({ contentType: 'plp' })
    jest.advanceTimersByTime(FIVE_MINUTES - 1)
    await service.getMultipleContent({ contentType: 'plp' })
    expect(clientCP.listEntries).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1)
    await service.getMultipleContent({ contentType: 'plp' })
    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })
})
