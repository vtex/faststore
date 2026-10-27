import type { ContentEntry, EntryPathParams } from '@vtex/client-cp'

import { clientCMS, cmsPageCache } from '../../../src/server/cms'
import { ContentService } from '../../../src/server/content/service'
import type { ContentParams } from '../../../src/server/content/types'
import { isContentPlatformSource } from '../../../src/server/content/utils'

jest.mock('../../../src/server/content/utils', () => {
  const isContentPlatformSource = jest.fn(() => true)
  return {
    ...jest.requireActual('../../../src/server/content/utils'),
    isContentPlatformSource,
    isBranchPreview: (previewData?: {
      versionId?: string
      releaseId?: string
    }) =>
      isContentPlatformSource() &&
      !!(previewData?.versionId || previewData?.releaseId),
  }
})

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

describe('ContentService Content Platform single entry cache', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('shares one list and entry fetch across concurrent pages', async () => {
    const { service, clientCP } = createServiceWithClient([['generic']])

    const results = await Promise.all(
      Array.from({ length: 20 }, () =>
        service.getSingleContent({ contentType: 'globalSections' })
      )
    )

    expect(clientCP.listEntries).toHaveBeenCalledTimes(1)
    expect(clientCP.getEntry).toHaveBeenCalledTimes(1)
    for (const result of results) {
      expect(result.sections).toEqual([{ name: 'Generic' }])
    }
  })

  it('keeps separate entries per content type', async () => {
    const { service, clientCP } = createServiceWithClient([['generic']])

    await service.getSingleContent({ contentType: 'globalSections' })
    await service.getSingleContent({ contentType: 'globalHeaderSections' })
    await service.getSingleContent({ contentType: 'globalSections' })

    expect(
      clientCP.listEntries.mock.calls.map(([params]) => params.contentType)
    ).toEqual(['globalSections', 'globalHeaderSections'])
  })

  it('caches an empty optional content type', async () => {
    const { service, clientCP } = createServiceWithClient([[]])

    const first = await service.getSingleContent({
      contentType: 'globalFooterSections',
    })
    await service.getSingleContent({ contentType: 'globalFooterSections' })

    expect(first).toEqual({})
    expect(clientCP.listEntries).toHaveBeenCalledTimes(1)
    expect(clientCP.getEntry).not.toHaveBeenCalled()
  })

  it('does not cache an empty required content type', async () => {
    const { service, clientCP } = createServiceWithClient([[]])

    const first = await service.getSingleContent({
      contentType: 'globalSections',
    })
    await service.getSingleContent({ contentType: 'globalSections' })

    expect(first).toEqual({})
    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })

  it('picks up a required content type published after an empty lookup', async () => {
    const { service, clientCP } = createServiceWithClient([['generic']])
    clientCP.listEntries.mockResolvedValueOnce({ entries: [], scroll: null })

    const before = await service.getSingleContent({
      contentType: 'globalSections',
    })
    const after = await service.getSingleContent({
      contentType: 'globalSections',
    })
    await service.getSingleContent({ contentType: 'globalSections' })

    expect(before).toEqual({})
    expect(after.sections).toEqual([{ name: 'Generic' }])
    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })

  it('does not cache lookups by slug', async () => {
    const { service, clientCP } = createServiceWithClient([['generic']])

    await service.getSingleContent({ contentType: 'landingPage', slug: 'a' })
    await service.getSingleContent({ contentType: 'landingPage', slug: 'a' })

    expect(clientCP.getEntryBySlug).toHaveBeenCalledTimes(2)
    expect(clientCP.listEntries).not.toHaveBeenCalled()
  })

  it('does not cache filtered lookups', async () => {
    const { service, clientCP } = createServiceWithClient([['generic']])
    const params: ContentParams = {
      contentType: 'globalSections',
      filters: { page: 1 },
    }

    await service.getSingleContent(params)
    await service.getSingleContent(params)

    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })

  it('bypasses the cache for branch previews', async () => {
    const { service, clientCP } = createServiceWithClient([['generic']])
    const branchPreview: ContentParams = {
      contentType: 'globalSections',
      previewData: {
        contentType: 'landingPage',
        documentId: 'some-landing-page',
        versionId: 'branch-1',
      },
    }

    await service.getSingleContent({ contentType: 'globalSections' })
    await service.getSingleContent(branchPreview)
    await service.getSingleContent(branchPreview)
    await service.getSingleContent({ contentType: 'globalSections' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(3)
    expect(clientCP.getEntry).toHaveBeenCalledTimes(1)
    expect(clientCP.previewEntryById).toHaveBeenCalledTimes(2)
  })

  it('does not cache a multiple-entries error', async () => {
    const { service, clientCP } = createServiceWithClient([
      ['generic', 'collection'],
    ])

    await expect(
      service.getSingleContent({ contentType: 'globalSections' })
    ).rejects.toThrow()
    await expect(
      service.getSingleContent({ contentType: 'globalSections' })
    ).rejects.toThrow()

    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })

  it('fetches again after the TTL', async () => {
    jest.useFakeTimers()
    const { service, clientCP } = createServiceWithClient([['generic']])

    await service.getSingleContent({ contentType: 'globalSections' })
    jest.advanceTimersByTime(FIVE_MINUTES)
    await service.getSingleContent({ contentType: 'globalSections' })

    expect(clientCP.listEntries).toHaveBeenCalledTimes(2)
  })
})

describe('ContentService Headless CMS single content cache', () => {
  const locator = {
    contentType: 'globalSections',
    documentId: 'doc-1',
    versionId: 'version-1',
  }
  const originalGetCMSPage = clientCMS.getCMSPage

  beforeEach(() => {
    jest.mocked(isContentPlatformSource).mockReturnValue(false)
    cmsPageCache.clear()
    clientCMS.getCMSPage = jest.fn(async () => ({
      id: 'doc-1',
      sections: [{ name: 'Children' }],
    })) as unknown as typeof clientCMS.getCMSPage
  })

  afterEach(() => {
    jest.mocked(isContentPlatformSource).mockReturnValue(true)
    clientCMS.getCMSPage = originalGetCMSPage
  })

  it('reuses a published document fetched by locator', async () => {
    const service = new ContentService()

    await Promise.all([
      service.getSingleContent(locator),
      service.getSingleContent(locator),
    ])
    await service.getSingleContent(locator)

    expect(clientCMS.getCMSPage).toHaveBeenCalledTimes(1)
  })

  it('fetches the document on every preview request', async () => {
    const service = new ContentService()
    const previewParams: ContentParams = {
      ...locator,
      previewData: locator,
    }

    await service.getSingleContent(previewParams)
    await service.getSingleContent(previewParams)

    expect(clientCMS.getCMSPage).toHaveBeenCalledTimes(2)
  })
})
