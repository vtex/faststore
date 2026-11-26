import { describe, expect, it, vi } from 'vitest'

const mockExecute = vi.hoisted(() => vi.fn())
const mockGetSingleContent = vi.hoisted(() => vi.fn())
const mockGetPdpContent = vi.hoisted(() => vi.fn())

vi.mock('src/server', () => ({ execute: mockExecute }))
vi.mock('src/server/content/service', () => ({
  contentService: {
    getSingleContent: mockGetSingleContent,
    getPdpContent: mockGetPdpContent,
  },
}))
vi.mock('src/server/cms/global', () => ({
  injectGlobalSections: vi.fn(() => ({ sections: [], settings: {} })),
}))
vi.mock('src/components/cms/GlobalSections', () => ({
  getGlobalSectionsData: vi.fn(() => [
    Promise.resolve(null),
    Promise.resolve(null),
    Promise.resolve(null),
  ]),
}))
vi.mock('src/utils/dynamicContent', () => ({
  getDynamicContent: vi.fn(async () => null),
}))

import { getStaticProps as getHomeStaticProps } from 'src/pages/index'
import { getStaticProps as getPdpStaticProps } from 'src/pages/[slug]/p'

describe('page view analytics type', () => {
  it('returns type "home" from the home getStaticProps', async () => {
    mockGetSingleContent.mockResolvedValue({ sections: [], settings: {} })

    const result: any = await getHomeStaticProps({
      previewData: undefined,
      locale: undefined,
    } as any)

    expect(result.props.type).toBe('home')
  })

  it('returns type "pdp" from the PDP getStaticProps', async () => {
    mockExecute.mockResolvedValue({
      data: {
        product: {
          seo: {
            title: 'Product',
            description: 'Description',
            canonical: '/product-slug/p',
          },
          offers: {
            priceCurrency: 'USD',
            offers: [
              {
                price: 10,
                priceValidUntil: '2030-01-01',
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: { identifier: '1' },
              },
            ],
          },
        },
      },
      errors: [],
    })
    mockGetPdpContent.mockResolvedValue({ sections: [], settings: {} })

    const result: any = await getPdpStaticProps({
      params: { slug: 'product-slug' },
      previewData: undefined,
      locale: undefined,
    } as any)

    expect(result.props.type).toBe('pdp')
  })
})
