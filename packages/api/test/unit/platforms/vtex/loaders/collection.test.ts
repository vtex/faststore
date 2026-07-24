import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NotFoundError } from '../../../../../src/platforms/errors'
import type { Clients } from '../../../../../src/platforms/vtex/clients'
import type {
  ByLinkIdBrandResponse,
  ByLinkIdCategoryResponse,
  ByLinkIdCollectionResponse,
} from '../../../../../src/platforms/vtex/clients/commerce/types/ByLinkId'
import {
  getCollectionLoader,
  isCategory,
} from '../../../../../src/platforms/vtex/loaders/collection'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeCategory = (
  overrides: Partial<ByLinkIdCategoryResponse> = {}
): ByLinkIdCategoryResponse => ({
  id: 1,
  name: 'Name',
  linkId: 'name',
  fatherCategoryId: null,
  title: null,
  description: null,
  metaTagDescription: null,
  availableLinkIds: null,
  ...overrides,
})

const makeBrand = (
  overrides: Partial<ByLinkIdBrandResponse> = {}
): ByLinkIdBrandResponse => ({
  id: 10,
  name: 'Brand',
  linkId: 'brand',
  title: null,
  description: null,
  metaTagDescription: null,
  availableLinkIds: null,
  ...overrides,
})

const makeCollection = (
  overrides: Partial<ByLinkIdCollectionResponse> = {}
): ByLinkIdCollectionResponse => ({
  id: 42,
  name: 'Collection',
  linkId: 'collection',
  title: null,
  description: null,
  metaTagDescription: null,
  availableLinkIds: null,
  ...overrides,
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockCategory = vi.fn()
const mockBrand = vi.fn()
const mockCollection = vi.fn()

/** Minimal Clients stub exposing only the catalog.byLinkId surface. */
function makeClients(): Clients {
  return {
    commerce: {
      catalog: {
        byLinkId: {
          category: mockCategory,
          brand: mockBrand,
          collection: mockCollection,
        },
      },
    },
  } as unknown as Clients
}

function makeLoader() {
  return getCollectionLoader({} as Options, makeClients())
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('getCollectionLoader', () => {
  beforeEach(() => {
    mockCategory.mockReset()
    mockBrand.mockReset()
    mockCollection.mockReset()
  })

  describe('entity type cascade', () => {
    it('resolves to category when category by-linkid returns a match', async () => {
      mockCategory.mockResolvedValueOnce(
        makeCategory({ id: 1, name: 'Apparel', linkId: 'apparel' })
      )

      const result = await makeLoader().load({ slug: 'apparel' })

      expect(result.entityType).toBe('category')
      expect(mockBrand).not.toHaveBeenCalled()
      expect(mockCollection).not.toHaveBeenCalled()
    })

    it('falls through to brand when category returns null', async () => {
      mockCategory.mockResolvedValueOnce(null)
      mockBrand.mockResolvedValueOnce(
        makeBrand({ id: 10, name: 'Adidas', linkId: 'adidas' })
      )

      const result = await makeLoader().load({ slug: 'adidas' })

      expect(result.entityType).toBe('brand')
      expect(mockCollection).not.toHaveBeenCalled()
    })

    it('falls through to collection when both category and brand return null', async () => {
      mockCategory.mockResolvedValueOnce(null)
      mockBrand.mockResolvedValueOnce(null)
      mockCollection.mockResolvedValueOnce(
        makeCollection({ id: 42, name: 'Summer Sale', linkId: 'summer-sale' })
      )

      const result = await makeLoader().load({ slug: 'summer-sale' })

      expect(result.entityType).toBe('collection')
    })

    it('throws NotFoundError when all three steps return null', async () => {
      mockCategory.mockResolvedValueOnce(null)
      mockBrand.mockResolvedValueOnce(null)
      mockCollection.mockResolvedValueOnce(null)

      await expect(
        makeLoader().load({ slug: 'nonexistent' })
      ).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('slug normalization', () => {
    it('lowercases a mixed-case slug before hitting the API', async () => {
      mockCategory.mockResolvedValueOnce(
        makeCategory({ linkId: 'computer---software' })
      )

      await makeLoader().load({ slug: 'Computer---Software' })

      expect(mockCategory).toHaveBeenCalledWith(
        'computer---software',
        undefined
      )
    })

    it('dedupes cache entries that only differ by casing', async () => {
      mockCategory.mockResolvedValueOnce(makeCategory({ linkId: 'sporting' }))

      const loader = makeLoader()

      await Promise.all([
        loader.load({ slug: 'Sporting' }),
        loader.load({ slug: 'sporting' }),
      ])

      expect(mockCategory).toHaveBeenCalledTimes(1)
    })

    it('preserves the full slug (lowercased) on the returned category root', async () => {
      mockCategory.mockResolvedValueOnce(
        makeCategory({ id: 2, name: 'T-Shirts', linkId: 'camisetas' })
      )

      const result = await makeLoader().load({ slug: 'vestuario/Camisetas' })

      expect(isCategory(result)).toBe(true)
      if (isCategory(result)) {
        // The slug field must be the full lowercased path, not just the last segment
        expect(result.slug).toBe('vestuario/camisetas')
      }
    })
  })

  describe('multi-segment slugs', () => {
    it('passes the full path to the category API for unambiguous resolution', async () => {
      mockCategory.mockResolvedValueOnce(
        makeCategory({
          id: 3,
          name: 'T-Shirts',
          linkId: 'shirts',
          fatherCategoryId: 1,
        })
      )

      await makeLoader().load({ slug: 'apparel/shirts' })

      // The full path must be sent so the API can validate each segment and
      // return only the category that is a direct child of "apparel".
      expect(mockCategory).toHaveBeenCalledWith('apparel/shirts', undefined)
    })
  })

  describe('locale forwarding', () => {
    it('forwards the locale from the load key to by-linkid', async () => {
      mockCategory.mockResolvedValueOnce(makeCategory({ linkId: 'vestuario' }))

      await makeLoader().load({ slug: 'vestuario', locale: 'pt-BR' })

      expect(mockCategory).toHaveBeenCalledWith('vestuario', 'pt-BR')
    })

    it('passes undefined locale when the load key omits it', async () => {
      mockCategory.mockResolvedValueOnce(makeCategory({ linkId: 'apparel' }))

      await makeLoader().load({ slug: 'apparel' })

      expect(mockCategory).toHaveBeenCalledWith('apparel', undefined)
    })

    it('does not share cache entries across different locales for the same slug', async () => {
      mockCategory
        .mockResolvedValueOnce(
          makeCategory({ linkId: 'apparel', name: 'Apparel' })
        )
        .mockResolvedValueOnce(
          makeCategory({ linkId: 'vestuario', name: 'Vestuário' })
        )

      const loader = makeLoader()

      const [en, pt] = await Promise.all([
        loader.load({ slug: 'apparel', locale: 'en-US' }),
        loader.load({ slug: 'apparel', locale: 'pt-BR' }),
      ])

      expect(mockCategory).toHaveBeenCalledTimes(2)
      expect(mockCategory).toHaveBeenCalledWith('apparel', 'en-US')
      expect(mockCategory).toHaveBeenCalledWith('apparel', 'pt-BR')
      expect([en.name, pt.name].sort()).toEqual(['Apparel', 'Vestuário'].sort())
    })
  })
})
